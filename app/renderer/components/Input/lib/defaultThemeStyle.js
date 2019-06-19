const defaultThemeStyle = ({ theme }) => {
  const { colors } = theme;

  return {
    borderColor: colors.V400,
    background: 'rgba(114,94,255,0.5)',
    readOnlyBackground: 'rgba(114,94,255,0.3)',
    readOnlyBorderColor: 'rgba(114,94,255,0.3)',
    color: colors.N0,
    focusBorderColor: colors.V500,
    placeholderColor: colors.V400,
    size: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  };
};

export default defaultThemeStyle;
