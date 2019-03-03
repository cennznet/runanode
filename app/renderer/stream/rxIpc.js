import { Subject } from 'rxjs/Subject';
import { cennznetStateChangeChannel, cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';
import config from 'app/config';
import payload from './payload';
import streamTypes from './types';

export class RxIpc {
  nodeStateSubject = new Subject();

  constructor(url: string) {
    this._config.url = url;
    this._nodeStateChannel = cennznetStateChangeChannel;
    this._nodeStatusChannel = cennznetStatusChannel;
  }

  subscribe() {
    console.log('subscribe rxIPC');
    this._nodeStateChannel.onReceive(this._handleReceiveState);
  }

  unsubscribe() {
    console.log('unsubscribe rxIPC');
    this._nodeStateChannel.removeAllListeners();
  }

  _handleReceiveState(state) {
    this.nodeStateSubject.next(state);
  }
}

export default new RxIpc();
