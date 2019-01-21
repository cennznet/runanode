import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapStateToProps = ({ syncStream, syncRemoteStream }) => ({
  hasBlockNumbers: syncStream.blockNum !== null && syncRemoteStream.blockNum !== null,
});

const mapDispatchToProps = dispatch => ({
  onPageLoad: () => {
    dispatch({
      type: types.homePageLoad.triggered,
    });
  },
});

const enhance = lifecycle({
  componentDidUpdate() {
    this.props.hasBlockNumbers && this.props.onPageLoad();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
