import { connect } from 'react-redux';
import { storageKeys } from 'renderer/api/utils/storage';

const mapStateToProps = ({ localStorage }) => ({
  isStakingStated: !!localStorage[storageKeys.STAKING_STASH_ACCOUNT_ADDRESS],
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
