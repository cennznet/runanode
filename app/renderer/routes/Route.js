import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route as ReactRoute } from 'react-router-dom';

const mapStateToProps = ({ nodeStateStore }) => ({
  nodeState: nodeStateStore,
});

const mapDispatchToProps = dispatch => ({});

const Route = ({ children, nodeState, ...props }) => {
  return <ReactRoute {...props}>{children}</ReactRoute>;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Route);
