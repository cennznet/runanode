import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route as ReactRoute } from 'react-router-dom';
import types from 'renderer/types';

const mapStateToProps = ({ nodeStateStore }) => ({
  nodeState: nodeStateStore,
});

const mapDispatchToProps = dispatch => ({
  onIpcNodeState: payload => {
    dispatch({
      type: types.ipcNodeState.triggered,
      payload,
    });
  },
});

const Route = ({ children, nodeState, ...props }) => {
  useEffect(() => {
    props.onIpcNodeState('SUBSCRIBE');
    return () => {
      props.onIpcNodeState('UNSUBSCRIBE');
    };
  });

  console.log('nodeState', nodeState);

  return <ReactRoute {...props}>{children}</ReactRoute>;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Route);
