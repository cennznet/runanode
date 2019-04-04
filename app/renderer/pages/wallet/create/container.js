import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { STEPS } from './constants';

const mapStateToProps = ({
  nodeSystem: {
    localNode: { chain },
  },
  localStorage: { WALLETS },
}) => ({
  networkName: chain,
  existingWallets: WALLETS,
});

const mapDispatchToProps = dispatch => ({
  onCreateWallet: payload => {
    return window.appApi.createWalletWithHDKeyRing(payload);
  },

  onCreatePaperWallet: payload => {
    dispatch({ type: types.walletPaperGenerate.requested, payload });
  },

  onCompleteWalletCreation: payload => {
    dispatch({ type: types.walletCreatWithHDKR.requested, payload });
  },
});

const enhance = compose(
  lifecycle({
    componentDidMount() {},
  }),
  withState('isStoreWarningModalOpen', 'setStoreWarningModalOpen', false),
  withState('isSeedPhaseDownloadModalOpen', 'setSeedPhaseDownloadModalOpen', false),
  withStateHandlers(
    ({
      initStep = STEPS.NAME_INPUT,
      initMnemonic = '',
      initWalletName = '',
      initIsOpenPenPrepareModal = false,
      initError = null,
      initWallet = null,
    }) => ({
      step: initStep,
      mnemonicString: initMnemonic,
      walletName: initWalletName,
      isOpenPenPrepareModal: initIsOpenPenPrepareModal,
      error: initError,
      wallet: initWallet,
    }),
    {
      moveToStep: () => val => ({ step: val }),
      setMnemonicString: () => val => ({ mnemonicString: val }),
      setWalletName: () => val => ({ walletName: val }),
      setIsOpenPenPrepareModal: () => val => ({ isOpenPenPrepareModal: val }),
      setError: () => val => ({ error: val }),
      setWallet: () => val => ({ wallet: val }),
    }
  )
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
