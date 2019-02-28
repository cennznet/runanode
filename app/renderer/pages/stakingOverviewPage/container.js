import { connect } from 'react-redux';
import types from 'renderer/types';

const mapStateToProps = ({ staking }) => ({ staking });

const mapDispatchToProps = dispatch => ({
  onUpdateStakingOverview: () => {
    dispatch({
      type: types.updateStakingOverview.triggered,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
