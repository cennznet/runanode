import { connect } from 'react-redux';
import types from 'renderer/types';

import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';
import ROUTES from 'renderer/constants/routes';
import streamConstants from 'renderer/constants/stream';
import { Logger } from 'renderer/utils/logging';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';
import { ApiPromise } from '@cennznet/api';

const mapStateToProps = ({ nodeSystem, syncStream, syncRemoteStream, nodeStateStore }) => ({
  nodeSystem,
  syncStream,
  syncRemoteStream,
  nodeStateStore,
});

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    Logger.debug('onNetworkStatusClick debug');
    // dispatch({
    //   type: types.nodeWsSystemChainPolling.requested,
    //   payload: {},
    // });
    dispatch({
      type: types.nodeJsonRpcSystem.requested,
      payload: {},
    });
  },
  onGetHeaderClick: () => {
    // dispatch({
    //   type: types.nodeWsChainGetHeader.requested,
    //   payload: {},
    // });
    dispatch({
      type: types.nodeWsChainGetHeaderPolling.requested,
      payload: {},
    });
  },
  onGetRemoteHeaderClick: () => {
    dispatch({
      type: types.nodeWsRemoteChainGetHeader.requested,
      payload: {},
    });
  },
  onRestartNodeClick: () => {
    const options: CennzNetRestartOptions = {
      chain: NetworkNameOptions.CENNZNET_UAT,
    };
    restartCennzNetNodeChannel.send(options);
  },
  onStreamStart: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: streamConstants.CONNECT },
    });
  },
  onRemoteStreamStart: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: streamConstants.CONNECT },
    });
  },
  onStreamStop: () => {
    dispatch({
      type: types.syncStream.requested,
      payload: { command: streamConstants.DISCONNECT },
    });
  },
  onRemoteStreamStop: () => {
    dispatch({
      type: types.syncRemoteStream.requested,
      payload: { command: streamConstants.DISCONNECT },
    });
  },
  onChainSubscribeNewHead: () => {
    dispatch({
      type: types.nodeWsChainSubscribeNewHead.requested,
      payload: {},
    });
  },
  onNavToChooseNetwork: () => {
    dispatch({ type: types.navigation.triggered, payload: ROUTES.CHOOSE_NETWORK });
    dispatch({ type: types.resetLocalStorage.triggered });
  },
  onResetLocalStorage: () => {
    dispatch({ type: types.resetLocalStorage.triggered });
  },
  onWalletPaperGenerate: payload => {
    dispatch({ type: types.walletPaperGenerate.requested, payload });
  },
  onTransfer: payload => {
    window.odin.api.cennz.doGenericAssetTransfer(
      payload.assetId,
      payload.fromAddress,
      payload.toAddress,
      payload.amoumt,
      payload.wallet
    );
  },
  onTestToaster: () => {
    dispatch({
      type: types.successToaster.triggered,
      payload: {
        message: 'object payload',
        options: {
          autoClose: 100000,
        },
      },
    });
  },

  onStake: payload => {
    // window.odin.api.cennz.doStake(payload.wallet, payload.stashAccountAddress, '');
  },
  onStakeAndRestart: payload => {
    const { cennzNetRestartOptions, wallet, stashAccountAddress } = payload;
    // dispatch({ type: types.switchNetwork.triggered, payload: cennzNetRestartOptions });
    dispatch({ type: types.stake.triggered, payload });
  },
  onUnStake: payload => {
    window.odin.api.cennz.doUnStake(payload.wallet, payload.fromAddress, '');
  },
  onUnStakeAndRestart: payload => {
    const { cennzNetRestartOptions } = payload;
    // dispatch({ type: types.switchNetwork.triggered, payload: cennzNetRestartOptions });
    // no-op for now
  },
  onGetEraLength: () => {
    window.odin.api.cennz.getEraLength(eraLength =>
      Logger.debug(`CennznetApi::getEraLength success: ${eraLength}`)
    );
  },

  onGetEraProgress: () => {
    window.odin.api.cennz.getEraProgress(EraProgress =>
      Logger.debug(`CennznetApi::getEraProgress success: ${EraProgress}`)
    );
  },

  onGetValidators: () => {
    window.odin.api.cennz.getValidators(validators =>
      Logger.debug(`CennznetApi::getValidators success: ${validators}`)
    );
  },

  onGetSessioProgress: () => {
    window.odin.api.cennz.getSessionProgress(sessionProgress =>
      Logger.debug(`CennznetApi::getSessionProgress success: ${sessionProgress}`)
    );
  },

  onGetSessionLength: () => {
    window.odin.api.cennz.getSessionLength(sessionLength =>
      Logger.debug(`CennznetApi::getSessionLength success: ${sessionLength}`)
    );
  },

  onGetIntensions: () => {
    window.odin.api.cennz.getIntentions(intensions =>
      Logger.debug(`CennznetApi::getIntentions success: ${intensions}`)
    );
  },

  // onGetIntentionsBalances: () => {
  //   window.odin.api.cennz.getIntentionsBalances(intensionsBalances =>
  //     Logger.debug(`CennznetApi::getIntentionsBalances success: ${intensionsBalances}`)
  //   );
  // },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
