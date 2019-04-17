import theme from 'renderer/theme';

import getInputBorderColor from './getInputBorderColor';

const inputStateStyles = (
  p = {
    theme,
    themeSpace: 'input',
  }
) => `
  color: ${p.styles.color};
  border: ${getInputBorderColor(p)};

  background: ${p.readOnly ? p.theme.colors.V900 : p.styles.backgroundColor};

  &::placeholder {
    color: ${p.theme.colors.N200};
  }

  &:focus {
    outline: none;
    border: ${`1px solid ${p.readOnly ? p.theme.colors.border : getInputBorderColor(p)}`};
  }

  &:disabled {
    color: ${p.theme.colors.N700};
    background: ${`${p.theme.colors.N100}`};
    cursor: not-allowed;
  }
`;

export default inputStateStyles;
