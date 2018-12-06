import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from '@/types';

const mapStateToProps = ({ testPage: { text } }) => ({ text });
const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {
    dispatch({ type: types.testPage.triggered, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    this.props.onPageLoaded({
      text: 'Hello World!',
    });
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
