import { connect } from 'react-redux';
import { storageKeys } from 'renderer/api/utils/storage';

const mapStateToProps = ({ localStorage }) => ({
  isStakingStated:
    localStorage[storageKeys.STAKING_STATUS] === 'NEXT_UP' ||
    localStorage[storageKeys.STAKING_STATUS] === 'STAKING',
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
