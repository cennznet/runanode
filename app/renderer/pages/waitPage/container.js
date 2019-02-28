import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';

const mapStateToProps = ({nodeStateStore}) => ({
  nodeStateStore
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
