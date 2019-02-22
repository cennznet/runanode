import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: true,
};

const testConfig = {
  node: {
    shutDownTimeout: 5000,
    killTimeout: 5000,
    updateTimeout: 5000,
  },
};

export default R.mergeDeepRight(commonConfig, testConfig);
