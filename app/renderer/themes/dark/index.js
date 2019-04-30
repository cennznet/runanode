import R from 'ramda';
import defaultTheme, { colors as defaultColors, utils } from 'components/defaultTheme';
import mediaQueries from 'components/defaultTheme/media';
import * as appThemeColors from './appThemeColors';
import appComponentStyle from './appComponentStyle';

const colors = R.mergeDeepRight(defaultColors, appThemeColors);

const customTheme = {
  pageBackground: 'linear-gradient(180deg, #0B1E73 0%, #040C40 50%)',
  listitemHighlightGradient:
    'linear-gradient(90deg, rgba(210,38,242,0.5) 0%, rgba(8,24,127,0.5) 100%)',
  colors,
  components: appComponentStyle(colors),
};

const theme = R.mergeDeepRight(defaultTheme, customTheme);

const media = mediaQueries(theme.breakPoints);

export { colors, media, utils };
export default theme;
