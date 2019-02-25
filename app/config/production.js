import mergeOptions from 'merge-options';
import commonConfig from './common';

const feature = {
  // justAnotherFeature: false,
};

const prodConfig = {
  feature,
  // prod specific config comes here...
  gaTrackId: 'UA-132943388-1', // TODO: Change to UA-132910586-1 at the time of publishing
};

export default mergeOptions(commonConfig, prodConfig);
