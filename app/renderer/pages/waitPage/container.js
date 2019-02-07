import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';

const mapStateToProps = ({networkStatusStore}) => ({
  networkStatusStore
});

const mapDispatchToProps = dispatch => ({
});

const enhance = lifecycle({

  componentDidMount() {
  },

  componentDidUpdate() {
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
