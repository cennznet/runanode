import * as colors from './colors';
import media from './media';
import * as utils from './utils';

const theme = {
  borderRadius: '3px',
  colors: { ...colors },
  utils: { ...utils },
  fontSizeSm: '12px',
  fontSize: '14px',
  fontSizeLg: '1rem',
  fontFamily: `
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    'Fira Sans',
    Oxygen-Sans,
    'Ubuntu',
    'Helvetica Neue',
    sans-serif
  `,
  pageGradient: 'linear-gradient(180deg, #0B1E73 0%, #040C40 50%)',
  listitemHighlightGradient:
    'linear-gradient(90deg, rgba(210,38,242,0.5) 0%, rgba(8,24,127,0.5) 100%)',
  zIndex: {
    overlay: 20,
    above: 10,
    bump: 1,
    below: -1,
  },
  components: {
    // Button: {
    //   fontSize: {
    //     sm: '14px',
    //     md: '14px',
    //     lg: '1rem',
    //   },
    //   height: {
    //     sm: '1.5rem',
    //     md: '2rem',
    //     lg: '2.5rem',
    //   },
    //   color: {
    //     primary: colors.primary,
    //     danger: colors.danger,
    //     success: colors.success,
    //     warning: colors.warning,
    //     info: colors.info,
    //   },
    //   hoverColor: {
    //     primary: colors.B600,
    //     danger: colors.R600,
    //     success: colors.G600,
    //     warning: colors.Y600,
    //     info: colors.B600,
    //   },
    //   contrastColor: {
    //     primary: colors.N0,
    //     danger: colors.N0,
    //     success: colors.N0,
    //     warning: colors.N800,
    //     info: colors.N0,
    //   },
    // },
  },
};

export { colors, media, utils };

export default theme;
