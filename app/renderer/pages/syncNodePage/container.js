import { connect } from 'react-redux';

import type { TheNodeRestartOptions } from 'common/types/theNode.types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import types from 'renderer/types';
import { NetworkNameMapping, chainNameMapping } from 'common/types/theNode.types';
import ROUTES from 'renderer/constants/routes';

const mapStateToProps = ({ nodeSystem, blocksNew, blocksRemote, localStorage }) => ({
  nodeSystem,
  blocksNew,
  blocksRemote,
  localStorage,
});

const mapDispatchToProps = dispatch => ({
  onRestartNode: (payload: TheNodeRestartOptions) => {
    dispatch({ type: types.switchNetwork.triggered, payload });
  },
  navigateToCreateWallet: () => {
    dispatch({
      type: types.navigation.triggered,
      payload: ROUTES.WALLET.ROOT,
    });
  },
  onGetChainGetHeader: () => {
    dispatch({ type: types.nodeWsChainGetHeader.requested });
  },
  onNaviagteToChooseNetwork: () => {
    dispatch({
      type: types.navigation.triggered,
      payload: ROUTES.CHOOSE_NETWORK,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
