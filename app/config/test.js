import mergeOptions from 'merge-options';
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

export default mergeOptions(commonConfig, testConfig);
