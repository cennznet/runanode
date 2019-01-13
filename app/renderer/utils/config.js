const localURL = 'http://localhost:9933';
const remoteURL = 'http://10.9.30.55:9933';
const localStreamURL = 'ws://localhost:9944';
const remoteStreamURL = 'ws://10.9.30.55:9944';
const env = 'dev';

const config = {
  env,

  api: {
    localURL,
    localStreamURL,
    remoteURL,
    remoteStreamURL,
  },

  urls: {
    LOCAL_JSONRPC: `${localURL}/`,
    LOCAL_WS: `${localStreamURL}/`,
    REMOTE_JSONRPC: `${remoteURL}/`,
    REMOTE_WS: `${remoteStreamURL}/`,
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
  }
};

export default config;
