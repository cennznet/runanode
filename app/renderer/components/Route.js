import React, { PureComponent } from 'react';
import { Route as ReactRoute } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

const mapStateToProps = ({ syncStream, syncRemoteStream }) => ({
  hasBlockNumbers: syncStream.blockNum !== null && syncRemoteStream.blockNum !== null,
});

const mapDispatchToProps = dispatch => ({});

const enhance = lifecycle({
  componentDidMount() {},
});

const RouteComponent = ({ hasBlockNumbers, ...rest }) => {
  // if (!hasBlockNumbers) {
  //   return <div>syncing...</div>;
  // }

  return <ReactRoute {...rest} />;
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
)(RouteComponent);
