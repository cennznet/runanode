import R from 'ramda';
import defaultTheme, {
  media as mediaQueries,
  colors as defaultColors,
} from 'components/defaultTheme';

const customColors = {
  // override colors here...
  // brandPrimary: '#191919',
  // brandSecondary: defaultColors.R500,
};

const colors = R.mergeDeepRight(defaultColors, customColors);

const customTheme = {
  /** Components themeSpace */

  // button: {
  //   fontSize: {
  //     sm: '14px',
  //     md: '14px',
  //     lg: '1rem'
  //   },
  //   height: {
  //     sm: '1.5rem',
  //     md: '2rem',
  //     lg: '2.5rem'
  //   },
  //   color: {
  //     primary: colors.primary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //     info: colors.info
  //   },
  //   hoverColor: {
  //     primary: colors.B600,
  //     danger: colors.R600,
  //     success: colors.G600,
  //     warning: colors.Y600,
  //     info: colors.B600
  //   },
  //   contrastColor: {
  //     primary: colors.N0,
  //     danger: colors.N0,
  //     success: colors.N0,
  //     warning: colors.N800,
  //     info: colors.N0
  //   }
  // },
  colors,
};

const theme = R.mergeDeepRight(defaultTheme, customTheme);
const media = mediaQueries(theme.breakPoints);

export { colors, media };
export default theme;
