import { connect } from 'react-redux';

const mapStateToProps = ({
  appStore: {
    notificationBar: { type },
  },
  localStorage: { STAKING_STATUS },
}) => ({
  notificationType: type,
  isNodeInStaking: STAKING_STATUS === 'NEXT_UP' || STAKING_STATUS === 'STAKING',
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
