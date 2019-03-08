import { connect } from 'react-redux';

const mapStateToProps = ({
  appStore: {
    notificationBar: { type },
  },
}) => ({
  notificationType: type,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
