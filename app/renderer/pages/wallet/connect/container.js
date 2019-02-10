import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { STEPS, WALLETTYPE } from './constants';

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
    dispatch({ type: types.walletCreate.requested, payload });
  },
  onCreatePaperWallet: payload => {
    dispatch({ type: types.walletPaperGenerate.requested, payload });
  },
});

const enhance = compose(
  lifecycle({
    componentDidMount() {},
  }),

  withStateHandlers(
    ({
      initStep = STEPS.SEED_PHRASE_RECOVER,
      initRecoverWalletType = WALLETTYPE.HDWALLET,
      initMnemonic = '',
      initWalletName = '',
    }) => ({
      step: initStep,
      mnemonicString: initMnemonic,
      recoverWalletType: initRecoverWalletType,
      walletName: initWalletName,
    }),
    {
      moveToStep: () => val => ({ step: val }),
      setMnemonicString: () => val => ({ mnemonicString: val }),
      setWalletName: () => val => ({ walletName: val }),
      setRecoverWalletType: () => val => ({ recoverWalletType: val }),
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
