import { connect } from 'react-redux';
import types from 'renderer/types';

const mapStateToProps = ({ dev }) => ({ dev });

const mapDispatchToProps = dispatch => ({
  onNetworkStatusClick: () => {
    dispatch({
      type: types.nodeJsonRpcSystemName.requested,
      payload: {}
    });
    dispatch({
      type: types.nodeJsonRpcSystemHealth.requested,
      payload: {}
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps);
