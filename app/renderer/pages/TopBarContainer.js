// @flow
import React, { Component } from 'react';
import TopBar from 'renderer/components/layout/TopBar';

export default class TopBarContainer extends Component {

  render() {
    const networkName = 'Main net';
    const isSynced = false;
    const blockNum = 1234567890;
    const blockHeight = blockNum; // TODO
    const syncPercentage = 50;
    return (
      <TopBar
              networkName={networkName}
              blockNum={blockNum}
              blockHeight={blockHeight}
              isSynced={isSynced}
              syncPercentage={syncPercentage}
      />
    );
  }

}
