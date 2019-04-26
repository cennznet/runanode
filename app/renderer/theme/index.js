import R from 'ramda';
import defaultTheme, {
  media as mediaQueries,
  colors as defaultColors,
  utils,
} from 'components/defaultTheme';

import * as appThemeColors from './appThemeColors';
import appComponentStyle from './appComponentStyle';

const colors = R.mergeDeepRight(defaultColors, appThemeColors);

const customTheme = {
  colors,
  components: appComponentStyle(colors),
};

const theme = R.mergeDeepRight(defaultTheme, customTheme);
const media = mediaQueries(theme.breakPoints);

export { colors, media, utils };
export default theme;
