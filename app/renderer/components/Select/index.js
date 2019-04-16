import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';
import themeObj, { colors } from 'renderer/theme';

const StyledSelect = styled(ReactSelect)`
  .react-select__control {
    box-shadow: none;
    height: ${p => p.height};
    color: ${p => p.color};
    border-color: ${p => p.borderColor};
    font-weight: ${p => p.fontWeight};
    font-size: ${p => p.fontSize};
    background: ${p => p.backgroundColor};
    
    &:hover {
      border-color: ${p => p.borderHoverColor};
    }
  }

  .react-select__menu {
    border: 1px solid ${p => p.menuBorderColor};
    background: ${p => p.menuBackgroundColor};
  }

  .react-select__option--is-focused {
    color: ${p => p.focusColor};
    background: ${p => p.focusBackgroundColor};
  }

  .react-select__indicator-separator {
    background: ${p => p.borderColor || p.indicatorBackgroundColor};
  }

  .react-select__option--is-selected {
    background: ${p => p.selectedBackgroundColor};
    color: ${p => p.selectedColor};
    font-weight: ${p => p.selectedFontWeight};
  }
`;

StyledSelect.defaultProps = {
  theme: themeObj,
  themeSpace: 'select',

  fontSize: '14px',
  backgroundColor: 'rgba(114,94,255,0.5)',
  menuBackgroundColor: colors.V800,
  borderColor: colors.V400,
  height: '3rem',
  color: colors.N0,
  selectedFontWeight: 'bolder',
  selectedBackgroundColor: 'transparent',
  selectedColor: colors.N0,
  focusBackgroundColor: colors.V500,
  focusColor: colors.N0,
  indicatorBackgroundColor: colors.N100,
  menuBorderColor: colors.N100,
};

const Select = ({ disabled, ...props }) => (
  <StyledSelect classNamePrefix="react-select" isDisabled={disabled} {...props} />
);

export default Select;
