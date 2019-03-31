import mergeOptions from 'merge-options';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: false,
};

const prodConfig = {
  feature,
  // prod specific config comes here...
  gaTrackId: 'UA-132910586-1',
};

export default mergeOptions(commonConfig, prodConfig);
