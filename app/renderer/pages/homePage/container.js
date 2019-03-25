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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
