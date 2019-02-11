import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { STEPS, WALLETTYPE } from './constants';

const mapStateToProps = ({ localStorage: { WALLETS } }) => ({
  existingWallets: WALLETS,
});

const mapDispatchToProps = dispatch => ({
  onCreateWallet: payload => {
    dispatch({ type: types.walletCreate.requested, payload });
  },

  onValidateSKRWallet: async payload => {
    try {
      const wallet = await window.odin.api.cennz.createWalletWithSimpleKeyRing({
        mnemonic: payload,
        passphrase: '',
      });
      console.log('wallet', wallet);
      return { wallet };
    } catch (error) {
      return { checkWalletError: 'Invalid seed phrase' };
    }
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
      recoverWalletType: initRecoverWalletType,
      walletName: initWalletName,
      mnemonic: initMnemonic,
    }),
    {
      moveToStep: () => val => ({ step: val }),
      setWalletName: () => val => ({ walletName: val }),
      setRecoverWalletType: () => val => ({ recoverWalletType: val }),
      setMnemonic: () => val => ({ mnemonic: val }),
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
