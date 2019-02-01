// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from 'renderer/types';
import TopBar from './TopBar';

const mapStateToProps = ({ nodeSystem, remoteStream, syncStream, syncRemoteStream }) => ({
  nodeSystem,
  remoteStream,
  syncStream,
  syncRemoteStream,
});

const mapDispatchToProps = dispatch => ({
  onSwitchNetwork: payload => {
    dispatch({ type: types.storeNetworkOption.triggered, payload });
  },
});

class TopBarContainer extends Component {
  render() {
    const { nodeSystem, remoteStream, syncStream, syncRemoteStream, onSwitchNetwork } = this.props;
    const {
      localNode: { chain },
      name,
      version,
      isSynced,
      health,
    } = nodeSystem;
    const networkName = chain ? `${chain}` : 'Not connected';
    // const isSynced = false;

    const { blockNum: remoteBlockNum, bps: remoteBps } = syncRemoteStream;
    const { blockNum: localBlockNum, bps: localBps } = syncStream;
    const blockNum = `#${localBlockNum} / #${remoteBlockNum}`;
    const blockSpeed =
      localBps && remoteBps ? `${localBps.toFixed(2)}bps / ${remoteBps.toFixed(2)}bps` : '0 bps';

    const percentage = remoteBlockNum > 0 ? ((localBlockNum / remoteBlockNum) * 100).toFixed(2) : 0;
    const syncPercentage = `${percentage}%`;
    return (
      <TopBar
        networkName={networkName}
        blockNum={blockNum}
        blockSpeed={blockSpeed}
        isSynced={isSynced}
        syncPercentage={syncPercentage}
        onSwitchNetwork={onSwitchNetwork}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBarContainer);
