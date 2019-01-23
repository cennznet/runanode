import { trackEvent, trackPageView } from '@redux-beacon/google-analytics';
import STREAM from 'renderer/constants/stream';

const trackStreamConnect = trackEvent(action => {
  if (action.payload.command === STREAM.CONNECT) {
    return {
      category: 'stream',
      action: 'connection',
      label: 'connect',
      value: 1,
    };
  }

  if (action.payload.command === STREAM.DISCONNECT) {
    return {
      category: 'stream',
      action: 'connection',
      label: 'disconnect',
      value: 0,
    };
  }
});

const trackRouterChanged = trackPageView(action => ({
  page: action.payload.location.pathname,
}));

const eventsMap = {
  '@@router/LOCATION_CHANGE': trackRouterChanged,
  ODIN_SYNC_STREAM_REQUESTED: trackStreamConnect,
};

export default eventsMap;
