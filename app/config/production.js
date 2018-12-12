import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: false,
};

const prodConfig = {
  feature,
  // prod specific config comes here...
};

export default R.mergeDeepRight(commonConfig, prodConfig);
