import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route as ReactRoute } from 'react-router-dom';
import { storageKeys } from '../api/utils/storage';

const mapStateToProps = ({ nodeStateStore, localStorage }) => ({
  nodeState: nodeStateStore,
  isStakingStated: !!localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
});

const mapDispatchToProps = dispatch => ({});

const Route = ({ children, nodeState, ...props }) => {
  return <ReactRoute {...props}>{children}</ReactRoute>;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Route);
