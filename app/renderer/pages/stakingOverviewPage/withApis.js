import withApi from './withApi';

/**
 * Use when there are more than two apiMethods
 */

const withOdinApis = (...apiSections) =>
  apiSections && apiSections.map(apiSection => withApi(apiSection));

export default withOdinApis;
