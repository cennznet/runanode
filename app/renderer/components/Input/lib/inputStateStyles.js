import deepAssign from 'deep-assign';
import theme from 'renderer/theme';

import getInputBorderColor from './getInputBorderColor';

const defaultStyling = p => {
  const { colors } = p.theme;
  return {
    color: colors.N0,
    focusBorderColor: getInputBorderColor(p),
    backgroundColor: colors.V400,
  };
};

const styling = p => deepAssign({}, defaultStyling(p), p.theme[p.themeSpace], p.themeStyles);

const inputStateStyles = (
  p = {
    theme,
    themeSpace: 'input',
  }
) => `
  color: ${styling(p).color};
  border: ${getInputBorderColor(p)};

  background-color: ${p.readOnly ? p.theme.colors.N100 : styling(p).backgroundColor};

  &::placeholder {
    color: ${p.theme.colors.N200};
  }

  &:focus {
    outline: none;
    border: ${`1px solid ${p.readOnly ? p.theme.colors.border : styling(p).focusBorderColor}`};
  }

  &:disabled {
    color: ${p.theme.colors.N700};
    background-color: ${`${p.theme.colors.N100}`};
    cursor: not-allowed;
  }
`;

export default inputStateStyles;
