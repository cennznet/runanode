import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'common/types/types';
import { Logger } from 'renderer/utils/logging';

const mapStateToProps = ({ dev }) => ({ dev });

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    dispatch({
      type: types.nodeApiSystemName.requested,
      payload: {}
    });
    dispatch({
      type: types.nodeApiSystemHealth.requested,
      payload: {}
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps);
