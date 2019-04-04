import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { WALLET_TYPE } from 'renderer/constants/wallet';
import { STEPS } from './constants';

const mapStateToProps = ({ localStorage: { WALLETS } }) => ({
  existingWallets: WALLETS,
});

const mapDispatchToProps = dispatch => ({
  onCreateSKRWallet: payload => {
    dispatch({ type: types.walletCreatWithSKR.requested, payload });
  },

  onCreateHDKRWallet: payload => {
    dispatch({ type: types.walletRestoreWithHDKR.requested, payload });
  },

  onValidateHDKRWallet: async payload => {
    try {
      const wallet = await window.appApi.restoreWallet({
        mnemonic: payload,
        passphrase: '',
      });

      return { wallet };
    } catch (error) {
      return { checkWalletError: 'Invalid seed phrase' };
    }
  },

  onValidateSKRWallet: async payload => {
    try {
      const wallet = await window.appApi.createWalletWithSimpleKeyRing({
        mnemonic: payload,
        passphrase: '',
      });

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
      initRecoverWalletType = WALLET_TYPE.HD,
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
