import styledProps from 'styled-props';
import deepAssign from 'deep-assign';
import defaultStyling from './defaultStyling';

const buttonColor = (p, styling) => {
  const { colors } = p.theme;

  if (p.disabled) {
    return colors.N300;
  }

  if (p.flat || p.outline) {
    return styledProps(styling.color, 'color')(p);
  }

  return styledProps(styling.contrastColor, 'color')(p);
};

const buttonBgColor = (p, styling) => {
  const { colors } = p.theme;

  if (p.flat) {
    return 'transparent';
  }

  if (p.disabled) {
    return colors.N100;
  }

  if (p.outline) {
    return colors.N0;
  }

  return styledProps(styling.color, 'color')(p);
};

const buttonBorder = (p, styling) => {
  if (p.outline && !p.disabled) {
    return `2px solid ${styledProps(styling.borderColor, 'color')(p)}`;
  }

  if (p.disabled) {
    return 0;
  }

  return `2px solid ${styledProps(styling.borderColor, 'color')(p)}`;
};

const hoverBgColor = (p, styling) => {
  const { colors } = p.theme;

  if (p.flat) {
    return 'transparent';
  }

  if (p.disabled) {
    return colors.N100;
  }

  if (p.outline) {
    return '';
  }

  return styledProps(styling.hoverColor, 'color')(p);
};

const hoverColor = (p, styling) => {
  const { colors } = p.theme;

  if (p.disabled) {
    return colors.N300;
  }

  if (p.flat || p.outline) {
    return styledProps(styling.hoverColor, 'color')(p);
  }

  return '';
};

const hoverBorderColor = (p, styling) => {
  if (p.disabled) {
    return 0;
  }

  return `2px solid ${styledProps(styling.hoverBorderColor, 'color')(p)}`;
};

const buttonStyles = props => {
  const styling = deepAssign(
    {},
    defaultStyling(props.theme),
    props.theme[props.themeSpace],
    props.themeStyles
  );

  const p = Object.assign(
    {
      color: 'primary',
      size: 'md',
    },
    props
  );

  return `
    align-items: center;
    background-color: ${buttonBgColor(p, styling)};
    border-radius: 3px;
    border: ${buttonBorder(p, styling)};
    color: ${buttonColor(p, styling)};
    cursor: ${p.disabled ? 'not-allowed' : 'pointer'};
    display: flex;
    font-size: ${styledProps(styling.fontSize, 'size')(p)};
    height: ${styledProps(styling.height, 'size')(p)};
    justify-content: center;
    outline: none;
    padding-left: ${p.iconBefore ? '0' : '1rem'};
    padding-right: ${p.iconAfter || p.loading ? '0' : '1rem'};
    text-decoration: none;
    user-select: none;
    width: ${p.block ? '100%' : ''};

    &:hover {
      background-color: ${hoverBgColor(p, styling)};
      color: ${hoverColor(p, styling)};
      border: ${hoverBorderColor(p, styling)};
    }
  `;
};

export default buttonStyles;
