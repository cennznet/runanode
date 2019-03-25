import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';

import type { CennzNetRestartOptions } from 'common/types/cennznet-node.types';
import { storageKeys } from 'renderer/api/utils/storage';
import { Logger } from 'renderer/utils/logging';
import { restartCennzNetNodeChannel } from 'renderer/ipc/cennznet.ipc';
import types from 'renderer/types';
import { NetworkNameMapping, chainNameMapping } from 'common/types/cennznet-node.types';
import ROUTES from 'renderer/constants/routes';
import { NETWORK_OPTIONS } from 'renderer/pages/chooseNetworkPage';

const mapStateToProps = ({ nodeSystem, blocksNew, blocksRemote, localStorage }) => ({
  nodeSystem,
  blocksNew,
  blocksRemote,
  localStorage,
});

const mapDispatchToProps = dispatch => ({
  onRestartNode: (payload: CennzNetRestartOptions) => {
    dispatch({ type: types.switchNetwork.triggered, payload });
  },

  navigateToCreateWallet: () => {
    dispatch({
      type: types.navigation.triggered,
      payload: ROUTES.WALLET.ROOT,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
