import defaultTheme from 'renderer/components/defaultTheme';

const getInputBorderColor = ({
  valid,
  readOnly,
  theme = defaultTheme,
  computedThemeStyle,
  isFocused,
}) => {
  if (readOnly) {
    return `1px solid ${computedThemeStyle.readOnlyBorderColor}`;
  }

  if (isFocused) {
    return `1px solid ${computedThemeStyle.focusBorderColor}`;
  }

  if (valid === true) {
    return `1px solid ${theme.colors.success}`;
  }

  if (valid === false) {
    return `1px solid ${theme.colors.danger}`;
  }

  return `1px solid ${computedThemeStyle.borderColor}`;
};

export default getInputBorderColor;
