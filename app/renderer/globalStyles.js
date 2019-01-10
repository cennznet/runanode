import theme, { colors } from 'renderer/theme';

/**
 * Only app level global styles comes here,
 * component-specific class styles should go within component file
 */
const globalStyles = `
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    box-sizing: border-box;
    font-size: ${theme.fontSize};
    font-family: ${theme.fontFamily};
    color: ${colors.N0};
    background-color: ${colors.N1000};
  }
`;

export default globalStyles;
