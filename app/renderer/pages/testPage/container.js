import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import types from 'renderer/types';
import { ApiRx, ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import typeRegistry from '@polkadot/types/codec/typeRegistry';

/** For demo, improve later */
typeRegistry.register({
  AssetId: 'u32',
});

// Move to config.js later
const CENNZNET_NODE_1 = 'ws://localhost:9944';
const LOCAL_NODE = 'ws://localhost:9944';

// const provider = new WsProvider(CENNZNET_NODE_1);
// const localProvider = new WsProvider(LOCAL_NODE);

const getBestBlock = providerUrl => {
  const provider = new WsProvider(providerUrl);
  return new ApiRx(provider).rpc.chain.subscribeNewHead();
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
      // console.log(`Main Net Best block is at #${header.blockNumber}`);
      // console.log(`Main Net type is at ${typeof header.blockNumber.words[0]}`);
      this.props.onUpdateMainNetBestBlock(header.blockNumber.words[0] || header.blockNumber);
    });

    setInterval(() => {
      getBestBlock(LOCAL_NODE).subscribe(header => {
        // console.log(`Local Net Best block is at #${header.blockNumber}`);
        const latestLocalBlock = header.blockNumber.words[0] || header.blockNumber;
        if (this.props.mainNetBestBlock < latestLocalBlock) {
          console.log(
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
