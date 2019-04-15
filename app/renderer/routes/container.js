import { connect } from 'react-redux';
import { storageKeys } from 'renderer/api/utils/storage';
import stakingStatus from 'renderer/constants/stakingStatus';

const mapStateToProps = ({ localStorage }) => ({
  isStakingStated:
    localStorage[storageKeys.STAKING_STATUS] === stakingStatus.NEXT_UP ||
    localStorage[storageKeys.STAKING_STATUS] === stakingStatus.STAKING,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
