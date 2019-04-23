import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';
import mergeOptions from 'merge-options';
import theme from 'renderer/theme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    height: '3rem',
    fontSize: '14px',
    background: 'rgba(114,94,255,0.5)', // TODO: move to colcors
    borderColor: colors.V400,
    color: colors.N0,

    indicatorBackground: colors.N100,
    selectedFontWeight: 'bolder',
    selectedBackground: 'transparent',
    selectedColor: colors.N0,

    menuBackground: colors.V800,
    menuBorderColor: colors.N100,

    focusBackground: colors.V500,
    focusColor: colors.N0,
  };
};

const computedThemeStyle = p =>
  mergeOptions({}, defaultThemeStyle(p), p.themeStyle, p.theme[p.themeSpace]);

const StyledSelect = styled(ReactSelect)`
  .react-select__control {
    box-shadow: none;
    fontsize: ${p => computedThemeStyle(p).fontSize};
    height: ${p => computedThemeStyle(p).height};
    color: ${p => computedThemeStyle(p).color};
    border-color: ${p => computedThemeStyle(p).borderColor};
    font-weight: ${p => computedThemeStyle(p).fontWeight};
    background: ${p => computedThemeStyle(p).background};

    &:hover {
      border-color: ${p => computedThemeStyle(p).borderHoverColor};
    }
  }

  .react-select__menu {
    border: 1px solid ${p => computedThemeStyle(p).menuBorderColor};
    background: ${p => computedThemeStyle(p).menuBackground};
  }

  .react-select__option--is-focused {
    color: ${p => computedThemeStyle(p).focusColor};
    background: ${p => computedThemeStyle(p).focusBackground};
  }

  .react-select__indicator-separator {
    background: ${p =>
      computedThemeStyle(p).borderColor || computedThemeStyle(p).indicatorBackground};
  }

  .react-select__option--is-selected {
    background: ${p => computedThemeStyle(p).selectedBackground};
    color: ${p => computedThemeStyle(p).selectedColor};
    font-weight: ${p => computedThemeStyle(p).selectedFontWeight};
  }
`;

StyledSelect.defaultProps = {
  theme,
  themeSpace: 'select',
};

const Select = ({ disabled, ...props }) => (
  <StyledSelect classNamePrefix="react-select" isDisabled={disabled} {...props} />
);

export default Select;
