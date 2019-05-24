import * as darkTheme from './dark';

import * as lightTheme from './light';

/**
 *  As appTheme is picked when the app is initial,
 *  restart the app if the theme has been changed
 */
// const currentTheme = darkTheme;
const { default: theme, colors, utils, media } = lightTheme;

export { colors, utils, media };
export default theme;
