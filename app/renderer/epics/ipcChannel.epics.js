import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import types from 'renderer/types';
import { cennznetStateChangeChannel, cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';
import { Logger } from 'renderer/utils/logging';

const nodeStateChannelEpic = () =>
  new Observable(observer => {
    cennznetStateChangeChannel.onReceive(state => {
      Logger.debug(`cennznetStateChangeChannel onReceive call::`);
      observer.next(state);
    });
  }).pipe(
    map(state => {
      Logger.debug(`nodeStateChannelEpic state: ${state}`);
      return {
        type: types.nodeStateChange.triggered,
        payload: state,
      };
    })
  );

export default [nodeStateChannelEpic];
