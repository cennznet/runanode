import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Logger } from 'renderer/utils/logging';
import types from '../../types';

const mapStateToProps = ({ syncStream, syncRemoteStream }) => ({
  syncStream,
  syncRemoteStream,
});

const mapDispatchToProps = dispatch => ({
  // Hanle with the detailed network option in next PR
  onSyncRemoteStream: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: {},
    });
  },

  onSyncStream: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: {},
    });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    this.props.onSyncStream();
    this.props.onSyncRemoteStream();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
