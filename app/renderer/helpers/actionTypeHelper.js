import { syncStream, syncRemoteStream } from '../stream/stream';
import types from '../types';

export const isRemoteAction = (action) => {
  console.log(`isRemoteAction: ${JSON.stringify(action)}`);
  return action.type.startsWith('ODIN_NODE_WS_REMOTE');
};

export const getStream = (action) => {
  if (isRemoteAction(action)) {
    return syncRemoteStream;
  }
  return syncStream;
};

export const getStreamMessageChangedType = (action) => {
  if (isRemoteAction(action)) {
    return types.syncRemoteStreamMessage;
  }
  return types.syncStreamMessage;
};

export const getNodeWsChainGetHeaderType = (action) => {
  if (isRemoteAction(action)) {
    return types.nodeWsRemoteChainGetHeader;
  }
  return types.nodeWsChainGetHeader;
};
