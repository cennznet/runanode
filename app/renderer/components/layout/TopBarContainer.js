// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from 'renderer/types';
import { compose, lifecycle, withState } from 'recompose';
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

const enhance = compose(
  withState('isOpenNetworkWarningModal', 'setIsOpenNetworkWarningModal', false),
  withState('isUploadGenesisModal', 'setIsOpenUploadGenesisModal', true),
  withState('selectedNetwork', 'setSelectedNetwork', null)
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
