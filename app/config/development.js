import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: true,
};

const devConfig = {
  feature,
  // dev specific config comes here...
};

export default R.mergeDeepRight(commonConfig, devConfig);
