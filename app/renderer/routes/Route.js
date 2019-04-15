import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route as ReactRoute } from 'react-router-dom';

import { Logger } from 'renderer/utils/logging';
import stakingStatus from 'renderer/constants/stakingStatus';

import { storageKeys } from '../api/utils/storage';

const mapStateToProps = ({ nodeStateStore, localStorage }) => ({
  nodeState: nodeStateStore,
  isStakingStated:
    localStorage[storageKeys.STAKING_STATUS] === stakingStatus.NEXT_UP ||
    localStorage[storageKeys.STAKING_STATUS] === stakingStatus.STAKING,
});

const mapDispatchToProps = dispatch => ({});

const Route = ({ children, nodeState, isStakingStated, ...props }) => {
  Logger.debug(`Route, isStakingStated: ${isStakingStated}`);
  return (
    <ReactRoute {...props} {...{ isStakingStated }}>
      {children}
    </ReactRoute>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Route);
