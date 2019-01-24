import { connect } from 'react-redux';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import types from 'renderer/types';
import { STEPS } from './constants';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {},
});

const enhance = compose(
  lifecycle({
    componentDidMount() {},
  }),
  withStateHandlers(
    ({ initStep = STEPS.NAME_INPUT }) => ({
      step: initStep,
    }),
    {
      moveToStep: () => val => ({ step: val }),
    }
  )
);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
