import * as colors from './colors';

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
  zIndex: {
    overlay: 20,
    above: 10,
    bump: 1,
    below: -1,
  },
};

export { colors };

export default theme;
