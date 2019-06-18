/**
 *
 */
const configComponentStyle = colors => ({
  /**
   * ===== App layout components - TopBar, SideNav, SubNav, Menus, etc =====
   */
  // AppSideNav: {
  //   background: colors.N0,
  //   navItemColor: colors.N500,
  //   navItemHoverBackground: colors.primary,
  //   navItemHoverColor: colors.N0,
  //   navItemActiveColor: colors.primary,
  // },
  // AppSimpleSidebar: {
  //   background: colors.N0,
  // },
  // AppSubNav: {
  //   background: colors.N0,
  //   boxShadow: 'none',
  //   footerGradient: `none`,
  // },
  // AppSubNavAccountAddButton: {
  //   outline: true,
  // },
  // AppSubNavWalletAddButton: {
  //   size: 'lg',
  // },
  // AppSubNavCollapsibleMenu: {
  //   navItemColor: colors.textMuted,
  //   navItemHoverBackground: colors.primary,
  //   navItemHoverColor: colors.N0,
  //   navItemActiveBackground: lighten(0.3, colors.primary),
  //   navItemActiveColor: colors.primary,
  // },
  // AppSubNavCollapsibleMenuTitle: {
  //   fontSize: '1rem',
  //   color: colors.textMuted,
  //   hoverBackground: colors.primary,
  //   hoverColor: colors.N0,
  //   activeColor: colors.primary,
  // },
  // AppSubNavSimpleMenu: {
  //   navItemColor: colors.textMuted,
  //   navItemHoverBackground: colors.primary,
  //   navItemHoverColor: colors.N0,
  //   navItemActiveColor: colors.primary,
  // },
  // AppTopBar: {
  //   background: colors.N0,
  // },
  // AppTopBarSelect: {
  // height: '3rem',
  // fontSize: '14px',
  // background: colors.N0,
  // borderColor: colors.N0,
  // focusBackground: colors.brandPrimary,
  // focusColor: colors.N0,
  // selectedFontWeight: 'bolder',
  // selectedBackground: 'transparent',
  // selectedColor: colors.text,
  // menuBackground: colors.N0,
  // menuBorderColor: colors.N300,
  // separatorBackground: colors.N100,
  // },
  /**
   * ================== App specific components =========================
   */
  /**
   * ================= Reusable components ==============================
   */
  // Button: {
  // fontSize: {
  //     sm: theme.fontSizeSm,
  //     md: theme.fontSize,
  //     lg: theme.fontSizeLg,
  //   },
  //   size: {
  //     sm: '1.5rem',
  //     md: '2rem',
  //     lg: '2.5rem',
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
  //   hoverColor: {
  //     primary: darken(0.1, colors.primary),
  //     secondary: darken(0.1, colors.secondary),
  //     danger: darken(0.1, colors.danger),
  //     success: darken(0.1, colors.success),
  //     warning: darken(0.1, colors.warning),
  //     info: darken(0.1, colors.info),
  //     nuetral: darken(0.1, colors.nuetral),
  //   },
  // hoverBorderColor: {
  //     primary: darken(0.1, colors.primary),
  //     secondary: darken(0.1, colors.primary),
  //     danger: darken(0.1, colors.danger),
  //     success: darken(0.1, colors.success),
  //     warning: darken(0.1, colors.warning),
  //     info: darken(0.1, colors.info),
  //     nuetral: darken(0.1, colors.nuetral),
  // },
  //   contrastColor: {
  //     primary: colors.N0,
  //     secondary: colors.N0,
  //     danger: colors.N0,
  //     success: colors.N0,
  //     warning: colors.N800,
  //     info: colors.N0,
  //     nuetral: colors.N0,
  //   },
  // },
  // Checkbox: {
  //   color: {
  //     primary: colors.primary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //   },
  // },
  // Input: {
  //   borderColor: colors.border,
  //   background: '#FFFFFF',
  //   readOnlyBackground: '#CCC',
  //   readOnlyBorderColor: '#DDD',
  //   placeholderColor: '#AAA',
  //   color: colors.N800,
  //   focusBorderColor: colors.B500,
  //   size: {
  //     sm: '2rem',
  //     md: '3rem',
  //     lg: '4rem',
  //   },
  // },
  // Modal: {
  //   background: colors.V900,
  //   boxShadow: `0 2px 4px 0 ${colors.N900}`,
  //   overlayBackground: 'rgba(54, 58, 61, 0.7)',
  //   color: colors.N0,
  //   contentPadding: '2rem',
  //   footerPadding: '1rem',
  //   footerBorderTopColor: `1px solid ${colors.border}`,
  // },
  // Notification: {
  //   background: {
  //     info: colors.info,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //   },
  //   color: {
  //     info: colors.N800,
  //     danger: colors.N0,
  //     success: colors.N0,
  //     warning: colors.N800,
  //   },
  // Radio: {
  //   color: colors.primary,
  //   labelColor: colors.text,
  // },
  // Scrollable: {
  //   background: colors.V800,
  //   thumbBackground: 'rgba(255, 255, 255, 0.4)',
  //   gradientBottomBackground: 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, #040c40 100%)',
  // },
  // Select: {
  //  height: '3rem',
  // fontSize: '14px',
  // background: 'rgba(114,94,255,0.5)',
  // borderColor: colors.V400,
  // focusBackground: colors.V500,
  // focusColor: colors.N0,
  // selectedFontWeight: 'bolder',
  // selectedBackground: 'transparent',
  // selectedColor: colors.N0,
  // menuBackground: colors.V800,
  // menuBorderColor: colors.N100,
  // separatorBackground: colors.N100,
  // },
  // Spinner: {
  //   color: colors.primary,
  //   size: {
  //     xs: '10px',
  //     sm: '12px',
  //     md: '16px',
  //     lg: '24px',
  //     xl: '40px',
  //   },
  //   thickness: {
  //     xs: '2px',
  //     sm: '2px',
  //     md: '2px',
  //     lg: '2px',
  //     xl: '4px',
  //   },
  //   speed: '0.7s',
  // },
  // Table: {
  //   headerBackground: colors.V900,
  //   rowOddLineBackground: 'rgba(8, 24, 127, 0.7)',
  //   rowEvenLineBackground: 'rgba(8, 24, 127, 0.3)',
  // },
  // Tabs: {
  //   activeColor: colors.text,
  //   color: colors.textMuted,
  //   inkBarActiveColor: colors.primary,
  //   inkBarColor: colors.border,
  //   tabPaneHeight: '80vh',
  // },
  // Toggle: {
  //   variant: {
  //     primary: colors.primary,
  //     danger: colors.danger,
  //     success: colors.success,
  //     warning: colors.warning,
  //   },
  //   trackBackground: colors.N300,
  //   thumbBorderCorlor: colors.N300,
  //   thumbCheckedBorderColor: colors.N0,
  //   thumbDisabledBackground: colors.N300,
  // },
  // Tooltip: {
  //   background: '#A99DFF',
  //   color: colors.V900,
  // },
});

export default configComponentStyle;
