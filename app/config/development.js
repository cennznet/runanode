import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: true,
};

const devConfig = {
  feature,
  // dev specific config comes here...
  gaTrackId: 'UA-132943388-1',
  isDev: true,
  webSocket: {
    latency: {
      period: 15 * 1000,
    },
  },
};

export default R.mergeDeepRight(commonConfig, devConfig);
