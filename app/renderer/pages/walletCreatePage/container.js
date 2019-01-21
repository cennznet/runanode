import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {
    dispatch({ type: types.homePageLoad.triggered, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    // this.props.onPageLoaded();
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
