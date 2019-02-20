const commonConfig = {
  // Common config shared by dev and prod comes here...
  node: {},
  jsonRpc: {
    localUrl: 'http://localhost:9933',
    remoteUrl: 'http://cennznet-node-0.centrality.cloud:9933',
  },
  webSocket: {
    localStreamUrl: 'ws://localhost:9944',
    remoteStreamUrl: 'wss://cennznet-node-0.centrality.cloud:9944',
    latency: {
      period: 5 * 1000,
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
