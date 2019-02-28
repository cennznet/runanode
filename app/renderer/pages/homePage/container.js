import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';

import type { CennzNetNodeState, CennzNetStatus } from 'common/types/cennznet-node.types';
import { Logger } from 'renderer/utils/logging';
import { cennznetStateChangeChannel, cennznetStatusChannel } from 'renderer/ipc/cennznet.ipc';
import types from 'renderer/types';
import ROUTES from '../../constants/routes';

const mapStateToProps = ({ syncStream, syncRemoteStream }) => ({
  hasBlockNumbers: syncStream.blockNum !== null && syncRemoteStream.blockNum !== null,
});

const mapDispatchToProps = dispatch => ({
  onPageLoad: () => {
    dispatch({
      type: types.homePageLoad.triggered,
    });
  },

  onCennznetNodeStateChange: (state: CennzNetNodeState) => {
    Logger.info(`onCennznetNodeStateChange: handling cennznet-node state <${state}>`);
    dispatch({
      type: types.nodeStateChange.triggered,
      payload: state,
    });
  },

  onCennznetStatusChange: (status: CennzNetStatus) => {
    Logger.info(`onCennznetStatusChange: handling cennznet status <${status}>`);
    if(status.isNodeSafeExisting) {
      Logger.info(`isNodeSafeExisting, status: ${JSON.stringify(status)}`);
      dispatch({
        type: types.navigation.triggered,
        payload: ROUTES.WAIT,
      });
    }
    dispatch({
      type: types.cenznetStatusChange.triggered,
      payload: status,
    });
  },
});

const enhance = lifecycle({

  componentDidMount() {
    // Passively receive state changes of the cennznet-node
    cennznetStateChangeChannel.onReceive(this.props.onCennznetNodeStateChange);
    cennznetStatusChannel.onReceive(this.props.onCennznetStatusChange)
  },

  componentDidUpdate() {
    this.props.hasBlockNumbers && this.props.onPageLoad();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
