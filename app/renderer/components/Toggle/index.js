import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import mergeOptions from 'merge-options';
import ReactToggle from 'react-toggle';
import 'react-toggle/style.css';
import theme from 'components/defaultTheme';

const CustomToggle = ({ themeStyle, themeKey, variant, ...restProps }) => (
  <ReactToggle icons={false} {...restProps} />
);

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    variant: {
      primary: colors.primary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
    },

    trackBackground: colors.N300,
    thumbBorderCorlor: colors.N300,
    thumbCheckedBorderColor: colors.N0,
    thumbDisabledBackground: colors.N300,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const Toggle = styled(CustomToggle)`
  &.react-toggle {
    .react-toggle-track {
      width: 40px;
      height: 20px;
      background: ${p => computedThemeStyle(p).trackBackground};
    }

    .react-toggle-thumb {
      width: 18px;
      height: 18px;
      border: ${p => `1px solid ${computedThemeStyle(p).thumbBorderCorlor}`};
    }

    &.react-toggle--checked {
      .react-toggle-track {
        background: ${p => styledProps(computedThemeStyle(p).variant, 'variant')};
      }

      .react-toggle-thumb {
        width: 16px,
        height: 16px,
        top: 2px,
        left: 22px,
        border-color: ${p => computedThemeStyle(p).thumbCheckedBorderColor};
      }
    }

    &.react-toggle--focus {
      .react-toggle-thumb {
        box-shadow: none;
      }
    }

    &:active {
      &:not(.react-toggle--disabled) {
        .react-toggle-thumb {
          box-shadow: none;
        }
      }
    }

    &:hover&:not(.react-toggle--disabled) {
      .react-toggle-track {
        background: ${p => styledProps(computedThemeStyle(p).variant, 'variant')};
      }

      :not(.react-toggle--checked) {
        .react-toggle-track {
          background: ${p => computedThemeStyle(p).thumbDisabledBackground};
        }
      }
    }
  }
`;

Toggle.defaultProps = {
  variant: 'success',
  theme,
  themeKey: 'Toggle',
  themeStyle: {},
};

Toggle.propTypes = {
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  theme: PropTypes.object,
  themeKey: PropTypes.string,
  themeStyle: PropTypes.object,
  trackBackground: PropTypes.string,
  thumbBorderCorlor: PropTypes.string,
  thumbCheckedBorderColor: PropTypes.string,
  thumbDisabledBackground: PropTypes.string,
};

Toggle.displayName = 'Toggle';

/** @component */
export default Toggle;
