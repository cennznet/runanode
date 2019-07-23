import { connect } from 'react-redux';
import types from 'renderer/types';

import { restartTheNetNodeChannel } from 'renderer/ipc/theNode.ipc';
import ROUTES from 'renderer/constants/routes';
import { Logger } from 'renderer/utils/logging';
import { NetworkNameOptions } from 'common/types/theNode.types';
import { ApiPromise } from '@cennznet/api';

const mapStateToProps = ({
  blocksNew,
  blocksRemote,
  blocksFinalized,
  localStorage: { WALLETS },
  nodeStateStore,
  nodeSystem,
  balances,
}) => ({
  nodeSystem,
  blocksNew,
  blocksRemote,
  blocksFinalized,
  nodeStateStore,
  wallets: WALLETS,
  balances,
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
    const options = {
      chain: NetworkNameOptions.THENODE_RIMU,
    };
    restartTheNetNodeChannel.send(options);
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
    window.appApi.doGenericAssetTransfer(
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
    // dispatch({ type: types.resetAppUiState.triggered });
    // dispatch({ type: types.navigation.triggered, payload: ROUTES.SYNC_NODE });
  },

  onToggleGlobalModal: payload => {
    dispatch({
      type: types.toggleGlobalModal.triggered,
      payload,
    });
  },

  onStake: payload => {
    const stakingPreference = { unstakeThreshold: 3, validatorPayment: 0 };
    const passphrase = '';
    const statusCb = ({ events, status, type }) => {
      Logger.debug(`onStake status: ${status}`);
      // observer.next(type);
      if (status.isFinalized) {
        // observer.complete();
      }
    };
    window.appApi.doStake(
      payload.wallet,
      payload.stashAccountAddress,
      payload.balances,
      stakingPreference,
      passphrase,
      statusCb
    );
  },
  onSendNodeStatus: payload => {
    dispatch({ type: types.sendNodeStatusToIpcMain.requested, payload });
  },
  onStakeAndRestart: payload => {
    const { TheNodeRestartOptions, wallet, stashAccountAddress } = payload;
    // dispatch({ type: types.switchNetwork.triggered, payload: TheNodeRestartOptions });
    dispatch({ type: types.stake.triggered, payload });
  },
  onUnStake: payload => {
    window.appApi.doUnStake(payload.wallet, payload.fromAddress, '');
  },
  onUnStakeAndRestart: payload => {
    const { TheNodeRestartOptions } = payload;
    // dispatch({ type: types.switchNetwork.triggered, payload: TheNodeRestartOptions });
  },
  onGetEraLength: () => {
    window.appApi.getEraLength(eraLength =>
      Logger.debug(`devContainer::getEraLength success: ${eraLength}`)
    );
  },

  onGetEraProgress: () => {
    window.appApi.getEraProgress(EraProgress =>
      Logger.debug(`devContainer::getEraProgress success: ${EraProgress}`)
    );
  },

  onGetValidators: () => {
    window.appApi.getValidators(validators =>
      Logger.debug(`devContainer::getValidators success: ${validators}`)
    );
  },

  onGetSessionProgress: () => {
    window.appApi.getSessionProgress(sessionProgress =>
      Logger.debug(`devContainer::getSessionProgress success: ${sessionProgress}`)
    );
  },

  onGetSessionLength: () => {
    window.appApi.getSessionLength(sessionLength =>
      Logger.debug(`devContainer::getSessionLength success: ${sessionLength}`)
    );
  },

  onGetIntensions: () => {
    window.appApi.getIntentions(intensions =>
      Logger.debug(`devContainer::getIntentions success: ${intensions}`)
    );
  },

  // onGetIntentionsBalances: () => {
  //   window.appApi.getIntentionsBalances(intensionsBalances =>
  //     Logger.debug(`devContainer::getIntentionsBalances success: ${intensionsBalances}`)
  //   );
  // },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
