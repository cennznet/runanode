import { connect } from 'react-redux';

import types from 'renderer/types';
import { Logger } from 'renderer/utils/logging';
import ROUTES from '../../constants/routes';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onAcceptTermsOfUse: () => {
    dispatch({ type: types.acceptTermsOfUse.triggered });
  },
  onNavToSettingGeneralPage: () => {
    Logger.debug(`onNavToSettingGeneralPage`);
    dispatch(
      {
        type: types.navigation.triggered,
        payload: ROUTES.SETTINGS.GENERAL,
      }
    )
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
