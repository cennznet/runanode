import themeObj from 'renderer/theme';

const getInputBorderColor = ({ disabled, valid, touched, theme = themeObj }) => {
  if (!disabled && valid === false && touched) {
    return `1px solid ${theme.colors.danger} !important`;
  }
  return `1px solid ${theme.colors.border}`;
};

export default getInputBorderColor;
