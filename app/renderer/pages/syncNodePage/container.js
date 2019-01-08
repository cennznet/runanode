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
const CENNZNET_NODE_1 = 'ws://localhost:9944';
const LOCAL_NODE = 'ws://localhost:9944';

// const provider = new WsProvider(CENNZNET_NODE_1);
// const localProvider = new WsProvider(LOCAL_NODE);

const getBestBlock = providerUrl => {
  const provider = new WsProvider(providerUrl);
  return new ApiRx({ provider, types: { AssetId: 'u32' } }).rpc.chain.subscribeNewHead();
};
/** For demo, improve later */

const mapStateToProps = ({ testPage: { text, mainNetBestBlock, localNetBestBlock } }) => ({
  text,
  mainNetBestBlock,
  localNetBestBlock,
});

const mapDispatchToProps = dispatch => ({
  onPageLoaded: payload => {
    dispatch({ type: types.testPage.triggered, payload });
  },
  onUpdateMainNetBestBlock: payload => {
    dispatch({ type: types.updateMainNetBestBlock.triggered, payload });
  },
  onUpdateLocalNetBestBlock: payload => {
    dispatch({ type: types.updateLocalNetBestBlock.triggered, payload });
  },
});

const enhance = lifecycle({
  componentDidMount() {
    this.props.onPageLoaded({
      text: 'Hello World!',
    });

    getBestBlock(CENNZNET_NODE_1).subscribe(header => {
      Logger.info(`Main Net Best block header: ${JSON.stringify(header)}`);
      Logger.info(`Main Net best #${header.blockNumber} ${typeof header.blockNumber}`);
      const latestMainNetBlock = JSON.stringify(header.blockNumber);
      this.props.onUpdateMainNetBestBlock(latestMainNetBlock);
    });

    setInterval(() => {
      getBestBlock(LOCAL_NODE).subscribe(header => {
        Logger.info(`Local Net Best block header: ${JSON.stringify(header)}`);
        Logger.info(`Local Net best #${header.blockNumber} ${typeof header.blockNumber}`);
        const latestLocalBlock = JSON.stringify(header.blockNumber);
        if (this.props.mainNetBestBlock && this.props.mainNetBestBlock < latestLocalBlock) {
          Logger.info(
            `The local bock #${latestLocalBlock} is larger than that of mainNet ${
              this.props.mainNetBestBlock
            }`
          );
        } else {
          this.props.onUpdateLocalNetBestBlock(latestLocalBlock);
        }
      });
    }, 15000);
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  enhance
);
