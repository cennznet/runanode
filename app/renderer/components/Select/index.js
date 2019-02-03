import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';
import themeObj, { colors } from 'renderer/theme';

const StyledSelect = styled(ReactSelect)`
  .react-select__control {
    box-shadow: none;
    color: ${p => p.color};
    border-color: ${p => p.borderColor};
    font-weight: ${p => p.fontWeight};
    font-size: ${p => p.fontSize};

    &:hover {
      border-color: ${p => p.borderHoverColor};
    }
  }

  .react-select__menu {
    border: 1px solid ${p => p.menuBorderColor};
    background-color: ${p => p.backgroundColor};
  }

  .react-select__option--is-focused {
    color: ${p => p.focusColor};
    background-color: ${p => p.focusBackgroundColor};
  }

  .react-select__indicator-separator {
    background-color: ${p => p.borderColor || p.indicatorBackgroundColor};
  }

  .react-select__option--is-selected {
    background-color: ${p => p.selectedBackgroundColor};
    color: ${p => p.selectedColor};
    font-weight: ${p => p.selectedFontWeight};
  }
`;

StyledSelect.defaultProps = {
  theme: themeObj,
  themeSpace: 'select',

  fontSize: '14px',
  backgroundColor: colors.V800,
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
