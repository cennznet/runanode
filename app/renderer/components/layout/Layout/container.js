import { connect } from 'react-redux';

const mapStateToProps = ({
  appStore: {
    uiState: { notificationType },
  },
}) => ({
  notificationType,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
