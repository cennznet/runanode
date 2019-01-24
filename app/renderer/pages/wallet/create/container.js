import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { STEPS } from './constants';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
});

const enhance = compose(
  lifecycle({
    componentDidMount() {},
  }),
  withStateHandlers(
    ({ initStep = STEPS.NAME_INPUT, initMnemonic = '', initWalletName = '' }) => ({
      step: initStep,
      mnemonicString: initMnemonic,
      walletName: initWalletName,
    }),
    {
      moveToStep: () => val => ({ step: val }),
      setMnemonicString: () => val => ({ mnemonicString: val }),
      setWalletName: () => val => ({ walletName: val }),
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
