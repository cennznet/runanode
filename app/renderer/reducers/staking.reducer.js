import R from 'ramda';
import types from '../types';

const DEFAULT_STATE = {
  stakingAccountAddress: '',
  stakingAccount: '',
  stakingWallet: '',
  manage: {
    stakingPreference: {
      unStakeThreshold: '',
      validatorPayment: '',
    }
  }
};

export default function staking(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case types.stakingGetValidatorPreferences.completed:
      return {
        ...state,
        manage: {
          stakingPreference: {
            unStakeThreshold: payload.unstakeThreshold.toString(),
            validatorPayment: payload.validatorPayment.toString(),
          }
        }
      };
    default:
      return state;
  }
}
