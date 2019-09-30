import { connect } from 'react-redux';
import types from 'renderer/types';

const mapStateToProps = ({ localStorage: { STAKING_STASH_ACCOUNT_ADDRESS } }) => ({
  stakingStashAccountAddress: STAKING_STASH_ACCOUNT_ADDRESS,
});

const mapDispatchToProps = dispatch => ({
  onUnStake: payload => {
    dispatch({ type: types.unStake.triggered, payload });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
