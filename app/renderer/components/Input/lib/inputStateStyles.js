import getInputBorderColor from './getInputBorderColor';

const inputStateStyles = p => `
  color: ${p.computedThemeStyle.color};
  border: ${getInputBorderColor(p)};

  background: ${
    p.readOnly ? p.computedThemeStyle.readOnlyBackground : p.computedThemeStyle.background
  };

  &::placeholder{
    color: ${p.computedThemeStyle.placeholderColor};
    opacity: 1; /* Firefox */
  }

  &:focus {
    outline: none;
    border: ${getInputBorderColor(Object.assign(p, { isFocused: true }))};
  }

  &:disabled {
    color: ${p.theme.colors.N700};
    background: ${`${p.theme.colors.N100}`};
    cursor: not-allowed;
  }
`;

export default inputStateStyles;
