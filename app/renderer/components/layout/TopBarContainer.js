// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import TopBar from './TopBar';

const mapStateToProps = ({nodeSystem, remoteStream, syncStream}) => ({
  nodeSystem, remoteStream, syncStream
});

class TopBarContainer extends Component {

  render() {
    const { nodeSystem, remoteStream, syncStream } = this.props;
    const { chain, name, version, isSynced, health } = nodeSystem;
    const networkName = chain ? `${chain}` : 'Not connected';
    // const isSynced = false;

    const { blockNum: remoteBlockNum, bps: remoteBps } = remoteStream;
    const { blockNum: localBlockNum, bps: localBps } = syncStream;
    const blockNum = `#${localBlockNum} / #${remoteBlockNum}`;
    const blockSpeed = `${localBps}bps / ${remoteBps}bps`;

    const percentage = remoteBlockNum > 0 ? (localBlockNum / remoteBlockNum * 100).toFixed(2) : 0 ;
    const syncPercentage = `${percentage}%`;
    return (
      <TopBar
        networkName={networkName}
        blockNum={blockNum}
        blockSpeed={blockSpeed}
        isSynced={isSynced}
        syncPercentage={syncPercentage}
      />
    );
  }

}

export default connect(mapStateToProps)(TopBarContainer);
