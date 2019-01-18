import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import ROUTES from 'renderer/constants/routes';
import types from '../../types';

const mapDispatchToProps = dispatch => ({
  onPageLoad: () => {
    dispatch({
      type: types.homePageLoad.triggered,
    });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    this.props.onPageLoad();
  },
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  enhance
);
