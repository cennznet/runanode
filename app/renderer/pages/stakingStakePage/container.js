import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';

const mapStateToProps = ({ appStore: { uiState }, localStorage: { WALLETS } }) => ({
  uiState,
  wallets: WALLETS,
});

const mapDispatchToProps = dispatch => ({
  onStake: payload => {
    dispatch({
      type: types.stake.triggered,
      payload,
    });
  },
});

const enhance = lifecycle({
  componentDidMount() {},
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
