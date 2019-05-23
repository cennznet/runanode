import { connect } from 'react-redux';
import { Logger } from 'renderer/utils/logging';
import types from 'renderer/types';
import ROUTES from '../../constants/routes';

const mapStateToProps = ({ blocksNew, blocksRemote }) => ({
  hasBlockNumbers: blocksNew.blockHeight !== null && blocksRemote.blockHeight !== null,
});

const mapDispatchToProps = dispatch => ({
  onPageNavigation: () => {
    Logger.info(`HomePage: calling <onPageNavigation>`);
    dispatch({
      type: types.homePageNavigation.triggered,
    });
  },

  onResetLocalStorage: () => {
    dispatch(
      { type: types.navigation.triggered, payload: ROUTES.TERMS_OF_USE_ACCEPTANCE },
      { type: types.resetLocalStorage.triggered }
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
