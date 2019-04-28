import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import mergeOptions from 'merge-options';
import RcCheckbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
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

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const StyledLabel = styled.label`
  display: flex;
`;

const StyledCheckbox = styled(RcCheckbox)`
  margin-right: 0.5rem;
  display: inline-block;

  &.rc-checkbox {
    .rc-checkbox-inner {
      background: ${p => p.theme.colors.N50};
      transition: none;

      &::after {
        width: 4px;
        height: 7px;
        border-color: ${p => p.theme.colors.N50};
      }
    }

    &:hover {
      .rc-checkbox-inner {
        border-color: ${p => styledProps(computedThemeStyle(p).color, 'variant')(p)};
      }
    }
  }

  .rc-checkbox-input {
    &:focus + .rc-checkbox-inner {
      border-color: ${p => styledProps(computedThemeStyle(p).color, 'variant')(p)};
    }
  }

  &.rc-checkbox-checked {
    .rc-checkbox-inner {
      border-color: ${p => styledProps(computedThemeStyle(p).color, 'variant')(p)};
      background: ${p => styledProps(computedThemeStyle(p).color, 'variant')(p)};

      &::after {
        width: 4px;
        height: 7px;
      }
    }
  }

  &.rc-checkbox-disabled {
    .rc-checkbox-input {
      cursor: not-allowed;
    }

    &:hover {
      .rc-checkbox-inner {
        border-color: ${p => p.theme.colors.N300};
      }
    }

    .rc-checkbox-inner {
      border-color: ${p => p.theme.colors.N300};
      background: ${p => p.theme.colors.N100};

      &::after {
        border-color: ${p => p.theme.colors.N100};
      }
    }
  }
`;

const CustomCheckbox = ({ children, ...props }) => (
  <StyledLabel>
    <StyledCheckbox {...props} />
    <div>{children}</div>
  </StyledLabel>
);

const Checkbox = styled(CustomCheckbox)``;

Checkbox.defaultProps = {
  theme,
  themeKey: 'Checkbox',
  themeStyle: {},
  variant: 'primary',
};

Checkbox.propTypes = {
  theme: PropTypes.object,
  themeKey: PropTypes.string,
  themeStyle: PropTypes.object,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
};

Checkbox.displayName = 'Checkbox';

/** @component */
export default Checkbox;
