import theme, { colors } from 'theme';

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
    color: ${colors.text};
    background: ${colors.V800};
  }

  p {
    line-height: 1.25rem;
  }
`;

export default globalStyles;
