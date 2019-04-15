import { connect } from 'react-redux';
import stakingStatus from 'renderer/constants/stakingStatus';

const mapStateToProps = ({
  appStore: {
    notificationBar: { type },
  },
  localStorage: { STAKING_STATUS },
}) => ({
  notificationType: type,
  isInStaking: STAKING_STATUS === stakingStatus.NEXT_UP || STAKING_STATUS === stakingStatus.STAKING,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
