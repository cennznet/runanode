const version = process.env.REACT_APP_VERSION;
const baseName = process.env.REACT_APP_BASE_NAME;
const streamURL = 'ws://localhost:9944'
const env = 'dev';

const config = {
  env,

  api: {
    baseName,
    streamURL,
    version,
  },

  connectivity: {
    latency: {
      period: 1000 * 5,
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
        }
      }
    }
  },

  pollingInterval: {
    blockHeight: 10 * 1000, // 10s
    transaction: 10 * 1000, // 10s
  }
};

export default config;
