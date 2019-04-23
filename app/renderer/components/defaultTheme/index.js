import * as colors from './colors';
import media from './media';

const theme = {
  borderRadius: '3px',
  colors: { ...colors },
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
};

export { colors, media };

export default theme;
