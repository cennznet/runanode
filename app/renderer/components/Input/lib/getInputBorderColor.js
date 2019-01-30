import themeObj from 'renderer/theme';

const getInputBorderColor = ({ valid, theme = themeObj }) => {
  if (valid === true) {
    return `1px solid ${theme.colors.success}`;
  }
  if (valid === false) {
    return `1px solid ${theme.colors.danger}`;
  }
  return `1px solid ${theme.colors.V400}`;
};

export default getInputBorderColor;
