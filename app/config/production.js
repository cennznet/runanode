import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: false,
};

const prodConfig = {
  feature,
  // prod specific config comes here...
  gaTrackId: 'UA-132910586-1',
};

export default R.mergeDeepRight(commonConfig, prodConfig);
