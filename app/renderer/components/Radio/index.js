import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import themeObject from 'components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    color: colors.primary,
    labelColor: colors.text,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const CustomInut = ({ theme, themeKey, themeStyle, ...p }) => {
  return <input {...p} />;
};

const RadioInput = styled(CustomInut)`
  &:checked,
  &:not(:checked) {
    position: absolute;
    left: -9999px;
  }

  &:checked + label,
  &:not(:checked) + label {
    position: relative;
    padding-left: 1.5rem;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    color: ${p => computedThemeStyle(p).labelColor};
  }
  &:checked + label:before,
  &:not(:checked) + label:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    border: 1px solid ${p => computedThemeStyle(p).color};
    border-radius: 100%;
  }
  &:checked + label:after,
  &:not(:checked) + label:after {
    content: '';
    width: 10px;
    height: 10px;
    background: ${p => computedThemeStyle(p).color};
    position: absolute;
    top: 4px;
    left: 4px;
    border-radius: 100%;
    -webkit-transition: all 0.1s ease;
    transition: all 0.2s ease;
  }
  &:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  &:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const RadioLabel = styled.label``;

const CustomRadio = ({ onChange, value, selected, children, ...props }) => {
  const id = `radio-${uuid()}`;
  return (
    <React.Fragment>
      <RadioInput
        type="radio"
        id={id}
        value={value}
        onChange={e => {
          onChange && onChange(e.target.value);
        }}
        checked={selected === value}
        {...props}
      />
      <RadioLabel htmlFor={id}>{children}</RadioLabel>
    </React.Fragment>
  );
};

const Radio = styled(CustomRadio)``;

// Radio.defaultProps = {
//   theme: themeObject,
//   themeKey: 'Radio',
//   themeStyle: {},
// };

Radio.displayName = 'Radio';

/** @components */
export default Radio;
