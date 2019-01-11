// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import TopBar from './TopBar';

const mapStateToProps = ({nodeSystem}) => ({
  nodeSystem
});

class TopBarContainer extends Component {

  render() {
    const { nodeSystem } = this.props;
    const { chain, name, version, isSynced } = nodeSystem;
    const networkName = `${chain} ${version}`;
    // const isSynced = false;
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

export default connect(mapStateToProps)(TopBarContainer);
