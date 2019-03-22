import mergeOptions from 'merge-options';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: true,
};

const devConfig = {
  feature,
  // dev specific config comes here...
  gaTrackId: 'UA-132943388-1',
  webSocket: {
    latency: {
      period: 5 * 1000,
    },
  },
};

export default mergeOptions(commonConfig, devConfig);
