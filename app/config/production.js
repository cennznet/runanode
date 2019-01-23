import R from 'ramda';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: false,
};

const prodConfig = {
  feature,
  // prod specific config comes here...
  gaTrackId: 'UA-132943388-1', // Change to UA-132910586-1 at the time of publishing
};

export default R.mergeDeepRight(commonConfig, prodConfig);
