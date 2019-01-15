import deepAssign from 'deep-assign';
import theme from 'renderer/theme';
import getInputBorderColor from './getInputBorderColor';

const defaultStyling = p => {
  const { colors } = p.theme;
  return {
    focusBorderColor: colors.primary,
  };
};

const styling = p => deepAssign({}, defaultStyling(p), p.theme[p.themeSpace], p.themeStyles);

const inputStateStyles = (
  p = {
    theme,
    themeSpace: 'input',
  }
) => `
  color: ${p.color || p.theme.colors.N500};
  border: ${`1px solid ${p.borderColor}` || getInputBorderColor(p)};

  background-color: ${p.readOnly ? p.theme.colors.N100 : p.backgroundColor || p.theme.colors.N0};

  &::placeholder {
    color: ${p.theme.colors.N300};
  }

  &:focus {
    outline: none;
    border: ${`1px solid ${
      p.readOnly ? p.theme.colors.border : p.focusBorderColor || styling(p).focusBorderColor
    }`};
  }

  &:disabled {
    color: ${p.theme.colors.N700};
    background-color: ${`${p.theme.colors.N100}`};
    cursor: not-allowed;
  }
`;

export default inputStateStyles;
