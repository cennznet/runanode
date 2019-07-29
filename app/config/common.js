import { remote } from 'electron';
import parseArgs from 'minimist';
import { NetworkNameMapping } from 'common/types/theNode.types';
import branding from './branding';

const commonConfig = {
  // Common config shared by dev and prod comes here...
  app: {
    name: 'rUN',
    apiInitDebounceTime: 10000, // after clean local chain data, api init need more than 6s
    defaultDebounceTime: 500,
    sentryDSN: 'https://0c4aa4aa53f1494e87d532890cb59529@sentry.io/1436322',
    networkOptions: [NetworkNameMapping.THENODE_RIMU, NetworkNameMapping.Development], // networkOptions[0] is the default network to be joined in, in this case, Rimu is by default to be connected.
    developmentGenesisFile: './genesis/local/local.json',
    // developmentGenesisFile: './genesis/local/intra-testnet.json',
  },
  branding,
  net: {
    name: 'CENNZNet',
  },
  node: {
    startupMaxRetry: 5,
    startupTimeout: 5000,
    shutDownTimeout: 10000,
    killTimeout: 10000,
    updateTimeout: 10000,
  },
  jsonRpc: {
    localUrl: 'http://localhost:9933',
    remoteUrl: 'https://cennznet-node-1.centrality.cloud:9933',
  },
  webSocket: {
    localStreamUrl: 'ws://localhost:9944',
    // localStreamUrl: 'ws://10.9.30.55:19944',
    remoteStreamUrl: 'wss://rimu.unfrastructure.io/public/ws:9944',
    remoteStreamUrlMap: {
      rimu: 'wss://rimu.unfrastructure.io/public/ws:9944',
      kauri: 'wss://cennznet-node-1.centrality.me:9944',
      development: 'ws://localhost:19944',
      // development: 'ws://10.9.30.55:19944', // for intra-testnet
    },
    latency: {
      period:
        remote && parseArgs(remote.process.argv).WEBSOCKET_LATENCY_PERIOD
          ? parseArgs(remote.process.argv).WEBSOCKET_LATENCY_PERIOD
          : 5 * 1000,
      signalLevel: {
        full: {
          level: 3,
          latency: [0, 100],
        },
        medium: {
          level: 2,
          latency: [100, 300],
        },
        weak: {
          level: 1,
          latency: [300, Infinity],
        },
      },
    },
  },
};

export default commonConfig;
