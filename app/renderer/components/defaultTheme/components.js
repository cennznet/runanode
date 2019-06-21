const configComponentStyle = colors => ({
  // Button: {
  //   borderWidth: '1px',
  //   fontSize: {
  //     sm: theme.fontSizeSm,
  //     md: theme.fontSize,
  //     lg: theme.fontSizeLg,
  //   },
  //   size: {
  //     sm: '1.5rem',
  //     md: '2rem',
  //     lg: '2.5rem',
  //   },
  //   background: {
  //     primary: colors.primary,
  //     secondary: colors.secondary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //     info: colors.info,
  //     nuetral: colors.nuetral,
  //   },
  //   color: {
  //     primary: colors.primary,
  //     secondary: colors.secondary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //     info: colors.info,
  //     nuetral: colors.nuetral,
  //   },
  //   borderColor: {
  //     primary: colors.primary,
  //     secondary: colors.secondary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //     info: colors.info,
  //     nuetral: colors.nuetral,
  //   },
  //   hoverBackground: {
  //     primary: darken(0.1, colors.primary),
  //     secondary: darken(0.1, colors.secondary),
  //     danger: darken(0.1, colors.danger),
  //     success: darken(0.1, colors.success),
  //     warning: darken(0.1, colors.warning),
  //     info: darken(0.1, colors.info),
  //     nuetral: darken(0.1, colors.nuetral),
  //   },
  //   hoverColor: {
  //     primary: darken(0.1, colors.primary),
  //     secondary: darken(0.1, colors.secondary),
  //     danger: darken(0.1, colors.danger),
  //     success: darken(0.1, colors.success),
  //     warning: darken(0.1, colors.warning),
  //     info: darken(0.1, colors.info),
  //     nuetral: darken(0.1, colors.nuetral),
  //   },
  //   hoverBorderColor: {
  //     primary: darken(0.1, colors.primary),
  //     secondary: darken(0.1, colors.secondary),
  //     danger: darken(0.1, colors.danger),
  //     success: darken(0.1, colors.success),
  //     warning: darken(0.1, colors.warning),
  //     info: darken(0.1, colors.info),
  //     nuetral: darken(0.1, colors.nuetral),
  //   },
  //   contrastColor: {
  //     primary: colors.N0,
  //     secondary: colors.N0,
  //     danger: colors.N0,
  //     success: colors.N0,
  //     warning: colors.N800,
  //     info: colors.N800,
  //     nuetral: colors.N0,
  //   },
  // },
  //  Checkbox: {
  //    color: {
  //      primary: colors.primary,
  //      danger: colors.danger,
  //      success: colors.success,
  //      warning: colors.warning,
  //    },
  //  },
  // Input: {
  //   borderColor: colors.border,
  //   background: colors.N0,
  //    readOnlyBackground: '#CCC',
  //    readOnlyBorderColor: '#DDD',
  //   color: colors.text,
  //   focusBorderColor: colors.primary,
  //   placeholderColor: colors.N300,
  //    size: {
  //      sm: '2rem',
  //      md: '3rem',
  //      lg: '4rem',
  //    },
  // },
  //  Modal: {
  //    backgroundColor: colors.background,
  //    boxShadow: `0 2px 4px 0 ${colors.N900}`,
  //    overlayBackground: 'rgba(54, 58, 61, 0.7)',
  //    color: colors.N0,
  //    contentPadding: '2rem',
  //    footerPadding: '1rem',
  //    footerBorderTopColor: `1px solid ${colors.border}`,
  //  },
  //  Notification: {
  //    background: {
  //      info: colors.info,
  //      danger: colors.danger,
  //      success: colors.success,
  //      warning: colors.warning,
  //    },
  //    color: {
  //      info: colors.N800,
  //      danger: colors.N0,
  //      success: colors.N0,
  //      warning: colors.N800,
  //    },
  // Radio: {
  //   color: colors.danger,
  //   labelColor: colors.text,
  // },
  //  Scrollable: {
  //    background: colors.V800,
  //    thumbBackground: 'rgba(255, 255, 255, 0.4)',
  //    gradientBottomBackground: 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, #040c40 100%)',
  //  },
  // Scrollable: {
  //   background: darken(0.9, colors.primary),
  //      thumbBackground: 'rgba(255, 255, 255, 0.4)',
  //   gradientBottomBackground: 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, colors.primary 100%)',
  // },
  // Select: {
  //   borderColor: colors.N300,
  //   menuBorderColor: colors.N300,
  //   background: colors.N0,
  //   menuBackground: colors.N0,
  //   focusBackground: colors.brandPrimary,
  //   selectedColor: colors.text,
  // },
  //  Spinner: {
  //    color: colors.primary,
  //    size: {
  //      xs: '10px',
  //      sm: '12px',
  //      md: '16px',
  //      lg: '24px',
  //      xl: '40px',
  //    },
  //    thickness: {
  //      xs: '2px',
  //      sm: '2px',
  //      md: '2px',
  //      lg: '2px',
  //      xl: '4px',
  //    },
  //    speed: '0.7s',
  //  },
  // Table: {
  //   headerBackground: colors.N0,
  //   rowOddLineBackground: colors.N100,
  //   rowEvenLineBackground: colors.N0,
  // },
  // Tabs: {
  //   activeColor: colors.text,
  //   color: colors.textMuted,
  //   inkBarActiveColor: colors.primary,
  //   inkBarColor: 'rgba(255, 255, 255, 0.3)',
  //   maxHeight: '100%',
  // },
  //  Toggle: {
  //    variant: {
  //      primary: colors.primary,
  //      danger: colors.danger,
  //      success: colors.success,
  //      warning: colors.warning,
  //    },
  //    trackBackground: colors.N300,
  //    thumbBorderCorlor: colors.N300,
  //    thumbCheckedBorderColor: colors.N0,
  //    thumbDisabledBackground: colors.N300,
  //  },
  // Tooltip: {
  //   background: colors.N700,
  //   color: colors.N0,
  // },
  // Toaster: {
  //   background: colors.N50,
  // },
  // Modal: {
  //   background: colors.N50,
  // },
});

export default configComponentStyle;
