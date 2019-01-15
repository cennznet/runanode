import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';

const mapStateToProps = ({ settings: { rememberNetwork } }) => ({ rememberNetwork });

const mapDispatchToProps = dispatch => ({
  onGetRememberNetwork: payload => {
    dispatch({ type: types.getRememberNetwork.requested });
  },
  onToggleRememberNetwork: payload => {
    dispatch({ type: types.toggleRememberNetwork.requested, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    this.props.onGetRememberNetwork();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
