import { connect } from 'react-redux';
import { Logger } from 'renderer/utils/logging';
import types from 'renderer/types';
import ROUTES from '../../constants/routes';

const mapStateToProps = ({ syncStream, syncRemoteStream }) => ({
  hasBlockNumbers: syncStream.blockNum !== null && syncRemoteStream.blockNum !== null,
});

const mapDispatchToProps = dispatch => ({
  onPageNavigation: () => {
    Logger.info(`HomePage: calling <onPageNavigation>`);
    dispatch({
      type: types.homePageNavigation.triggered,
    });
  },

  onSubscribeCennznetStatus: () => {
    dispatch({
      type: types.subscribeStatusChange.triggered,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
