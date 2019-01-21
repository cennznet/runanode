import { Subject } from 'rxjs/Subject';
import config from 'renderer/utils/config';
import payload from './payload';
import streamTypes from './types';

/**
 * @class Stream
 */
export class Stream {
  messageSubject = new Subject();
  statusSubject = new Subject();

  _config = {
    url: null,
    reconnectInterval: 200,
    reconnectIntervalMax: 2000,
  };

  /**
   * @type WebSocket
   */
  _socket = null;
  _isConnected = false;
  _isConnecting = false;
  _isAuthenticated = false;
  _retryCount = 0;
  _messageQueue = [];
  _authToken = null;
  _subscriptions = {};

  _nextId = 1;

  constructor(url: string) {
    this._config.url = url;
  }

  connect() {
    this._ensureWebSocket();
  }

  // connect(host) {
  //   this._config.url = host;
  //   this._ensureWebSocket();
  // }

  disconnect(retry = false) {
    if (!this._socket) {
      return;
    }
    this._socket.removeEventListener('open', this._handleOpen);
    this._socket.removeEventListener('message', this._handleError);
    this._socket.removeEventListener('close', this._handleError);
    this._socket.removeEventListener('error', this._handleError);
    this._socket.close();

    this._socket = null;

    this._updateStatus(false, retry, false);
  }

  send(type, data, requireAuth, immediately) {
    const id = this._nextId;
    this._nextId += 1;
    if (!immediately && this._messageQueue.length) {
      // ensure message sent order
      this._queueMessage({ id, type, data, requireAuth });
      this._sendNextInQueue();
      return id;
    }
    if (requireAuth && !this._isAuthenticated) {
      if (immediately) {
        return 0;
      }
      this._queueMessage({ id, type, data, requireAuth });
      return id;
    }
    if (this._isConnected) {
      try {
        this._socket.send(payload(id, type, data));
      } catch (err) {
        if (immediately) {
          return 0;
        }
        this._queueMessage({ id, type, data, requireAuth });
        setTimeout(() => {
          this._sendNextInQueue();
        }, 5);
      }
    } else {
      if (immediately) {
        return 0;
      }
      this._queueMessage({ id, type, data, requireAuth });
    }
    return id;
  }

  authenticate(token) {
    if (this._authToken === token) {
      return;
    }
    this._authToken = token;
    this._sendAuthenticate();
  }

  subscribe(type, data, requireAuth) {
    this._subscriptions[type] = {
      type,
      data,
      requireAuth,
    };
    this.send(type, data, requireAuth);
  }

  unsubscribe(type) {
    delete this._subscriptions[type];
    this.send(type, {});
  }

  ping() {
    return this.send(streamTypes.ping, {}, false, true);
  }

  pingWithStreamType(streamType) {
    return this.send(streamType, {}, false, true);
  }

  _sendAuthenticate() {
    // not require
    // const id = this.send(streamTypes.redeem, { ticket: this._authToken }, false, true);
    // this.messageSubject.filter(x => x.id === id).first().subscribe(({ data }) => {
    //   const isAuthenticated = data && data.success;
    //   this._updateStatus(true, false, isAuthenticated);
    //   if (isAuthenticated) { // send pending required auth messages
    //     this._sendNextInQueue();
    //   }
    // });
    return this;
  }

  _queueMessage(message, head = false) {
    if (head) {
      this._messageQueue.unshift(message);
    } else {
      this._messageQueue.push(message);
    }
    // do we need to log and drop message when queue is too large?
  }

  _sendNextInQueue() {
    if (this._messageQueue.length === 0) {
      return;
    }
    if (!this._isConnected) {
      return;
    }
    const next = this._messageQueue.shift();
    const { id, type, data, requireAuth } = next;
    if (requireAuth && !this._isAuthenticated) {
      this._queueMessage(next, true);
      return;
    }
    try {
      this._socket.send(payload(id, type, data));
    } catch (err) {
      this._queueMessage(next, true);
    }
    // ensure we don't send too much messages at time
    setTimeout(() => {
      this._sendNextInQueue();
    }, 5);
  }

  _ensureWebSocket() {
    if (this._socket) {
      if (this._socket.url === this._config.url) {
        return;
      }
      this.disconnect(true);
    }
    this._socket = new WebSocket(this._config.url);
    this._socket.addEventListener('open', this._handleOpen);
    this._socket.addEventListener('message', this._handleMessage);
    this._socket.addEventListener('close', this._handleError);
    this._socket.addEventListener('error', this._handleError);
  }

  _handleOpen = () => {
    this._retryCount = 0;
    this._updateStatus(true, false, false);
    // if (this._authToken) { // re auth if needed
    //   this._sendAuthenticate();
    // }
    // re subscribe if needed
    for (const sub of Object.values(this._subscriptions)) {
      this.send(sub.type, sub.data, sub.requireAuth);
    }
    this._sendNextInQueue();
  };

  _handleMessage = message => {
    try {
      const { data } = message;
      const streamPayload = JSON.parse(data);
      this.messageSubject.next(streamPayload);
    } catch (error) {
      // TODO: use logger
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  };

  _handleError = () => {
    this.disconnect(true);

    this._retryCount += 1;
    const wait = Math.min(
      this._retryCount * this._config.reconnectInterval,
      this._config.reconnectIntervalMax
    );
    setTimeout(() => {
      this._ensureWebSocket();
    }, wait);
  };

  _updateStatus(isConnected, isConnecting, isAuthenticated) {
    this._isConnected = isConnected;
    this._isConnecting = isConnecting;
    this._isAuthenticated = isAuthenticated;
    this.statusSubject.next({
      isConnected,
      isConnecting,
      isAuthenticated,
    });
  }
}

const defaultStream = new Stream(config.urls.LOCAL_WS);
export default defaultStream;
export const localStream = defaultStream;
export const remoteStream = new Stream(config.urls.REMOTE_WS);

if (module.hot) {
  module.hot.dispose(() => {
    defaultStream.disconnect();
  });
}
