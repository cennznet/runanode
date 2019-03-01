import { connect } from 'react-redux';
import types from 'renderer/types';

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const callApi = (sessions, dispatch) => {
  const sortedSessions = Array.isArray(sessions) ? sessions : [sessions];
  sortedSessions.forEach(session => {
    const apiMethod = `get${capitalize(session)}`;
    const actionMethod = `update${capitalize(session)}`;
    const updateField = session;
    window.odin.api.cennz[apiMethod](
      value =>
        value &&
        dispatch({
          type: types[actionMethod].triggered,
          payload: {
            [updateField]: Array.isArray(value)
              ? value.map(BNItem => BNItem.toString(10))
              : value.toString(10),
          },
        })
    );
  });
};

const mapStateToProps = ({ staking }) => ({ staking });

/**
 * @param {*}
 * Follow camel case
 * Ensure consistent name
 * apiMethod: get[string]
 * actionType: update[String]
 */
const mapDispatchToProps = dispatch => ({
  onSubscribeStakingData: () => {
    callApi(
      ['eraProgress', 'eraLength', 'sessionLength', 'sessionProgress', 'validators', 'intentions'],
      dispatch
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
