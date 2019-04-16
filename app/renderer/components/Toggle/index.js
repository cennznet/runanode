import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import mergeOptions from 'merge-options';
import ReactToggle from 'react-toggle';
import 'react-toggle/style.css';
import themeObj from 'renderer/theme';

const defaultStyling = p => {
  const { colors } = p.theme;

  return {
    color: {
      primary: colors.primary,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
    },
  };
};

const styling = p => mergeOptions({}, defaultStyling(p), p.theme[p.themeSpace], p.themeStyles);

const CustomToggle = ({ theme, themeStyles, themeSpace, color, ...restProps }) => (
  <ReactToggle icons={false} {...restProps} />
);

const Toggle = styled(CustomToggle)`
  &.react-toggle {
    .react-toggle-track {
      width: 40px;
      height: 20px;
      background: ${p => p.theme.colors.N300};
    }

    .react-toggle-thumb {
      width: 18px;
      height: 18px;
      border: ${p => `1px solid ${p.theme.colors.N300}`};
    }

    &.react-toggle--checked {
      .react-toggle-track {
        background: ${p => styledProps(styling(p).color, 'color')};
      }

      .react-toggle-thumb {
        width: 16px;
        height: 16px;
        top: 2px;
        left: 22px;
        border-color: #fff;
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
        background: ${p => styledProps(styling(p).color, 'color')};
      }

      :not(.react-toggle--checked) {
        .react-toggle-track {
          background: ${p => p.theme.colors.N300};
        }
      }
    }
  }
`;

Toggle.defaultProps = {
  color: 'success',
  theme: themeObj,
  themeSpace: 'toggle',
  themeStyles: {},
};

Toggle.propTypes = {
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
};

export default Toggle;
