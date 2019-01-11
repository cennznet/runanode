import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Logger } from 'renderer/utils/logging';
import types from '../../types';

/** For demo, improve later */
typeRegistry.register({
  AssetId: 'u32',
});

// Move to config.js later
// const CENNZNET_NODE_1 = 'ws://cennznet-node-1.centrality.me:9944';
const CENNZNET_NODE_1 = 'ws://cennznet-node-1.centrality.me:9944';
const LOCAL_NODE = 'ws://localhost:9944';

const getBestBlock = providerUrl => {
  const provider = new WsProvider(providerUrl);
  return new ApiRx({ provider, types: { AssetId: 'u32' } }).rpc.chain.subscribeNewHead();
};
/** For demo, improve later */

const mapStateToProps = ({ syncNode: { selectedNetwork, bestBlock, syncedBlock } }) => ({
  selectedNetwork,
  bestBlock,
  syncedBlock,
});

const mapDispatchToProps = dispatch => ({
  onUpdateBestBlock: payload => {
    dispatch({ type: types.updateBestBlock.triggered, payload });
  },
  onUpdateSyncedBlock: payload => {
    dispatch({ type: types.updateSyncedBlock.triggered, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    getBestBlock(CENNZNET_NODE_1).subscribe(header => {
      Logger.info(`Main Net Best block header: ${JSON.stringify(header)}`);
      const latestMainNetBlock = Number(header.blockNumber);
      this.props.onUpdateBestBlock(latestMainNetBlock);
    });

    setInterval(() => {
      getBestBlock(LOCAL_NODE).subscribe(header => {
        Logger.info(`Local Net Best block header: ${JSON.stringify(header)}`);
        const latestLocalBlock = Number(header.blockNumber);
        if (this.props.bestBlock < latestLocalBlock) {
          Logger.info(
            `The local best bock #${latestLocalBlock} > MainNet best block${this.props.bestBlock}`
          );
        } else {
          this.props.onUpdateSyncedBlock(latestLocalBlock);
        }
      });
    }, 10000);
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
