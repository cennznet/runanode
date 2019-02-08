import themeObj from 'renderer/theme';

const getInputBorderColor = ({ valid, theme = themeObj, styles }) => {
  if (valid === true) {
    return `1px solid ${theme.colors.success}`;
  }
  if (valid === false) {
    return `1px solid ${theme.colors.danger}`;
  }
  return `1px solid ${styles.borderColor}`;
};

export default getInputBorderColor;
