import { darken } from 'polished';

const defaultThemeStyle = ({ theme }) => {
  const { colors } = theme;

  return {
    borderWidth: '1px',
    fontSize: {
      sm: theme.fontSizeSm,
      md: theme.fontSize,
      lg: theme.fontSizeLg,
    },
    size: {
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
    },
    background: {
      primary: colors.primary,
      secondary: colors.secondary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
      nuetral: colors.nuetral,
    },
    color: {
      primary: colors.primary,
      secondary: colors.secondary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
      nuetral: colors.nuetral,
    },
    borderColor: {
      primary: colors.primary,
      secondary: colors.secondary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
      nuetral: colors.nuetral,
    },
    hoverBackground: {
      primary: darken(0.1, colors.primary),
      secondary: darken(0.1, colors.secondary),
      danger: darken(0.1, colors.danger),
      success: darken(0.1, colors.success),
      warning: darken(0.1, colors.warning),
      info: darken(0.1, colors.info),
      nuetral: darken(0.1, colors.nuetral),
    },
    hoverColor: {
      primary: darken(0.1, colors.primary),
      secondary: darken(0.1, colors.secondary),
      danger: darken(0.1, colors.danger),
      success: darken(0.1, colors.success),
      warning: darken(0.1, colors.warning),
      info: darken(0.1, colors.info),
      nuetral: darken(0.1, colors.nuetral),
    },
    hoverBorderColor: {
      primary: darken(0.1, colors.primary),
      secondary: darken(0.1, colors.secondary),
      danger: darken(0.1, colors.danger),
      success: darken(0.1, colors.success),
      warning: darken(0.1, colors.warning),
      info: darken(0.1, colors.info),
      nuetral: darken(0.1, colors.nuetral),
    },
    contrastColor: {
      primary: colors.N0,
      secondary: colors.N0,
      danger: colors.N0,
      success: colors.N0,
      warning: colors.N800,
      info: colors.N800,
      nuetral: colors.N0,
    },
  };
};

export default defaultThemeStyle;
