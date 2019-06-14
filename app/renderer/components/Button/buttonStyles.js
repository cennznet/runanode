import styledProps from 'styled-props';
import defaultThemeStyle from './defaultThemeStyle';

const buttonColor = (p, computedThemeStyle) => {
  const { colors } = p.theme;

  if (p.disabled) {
    return colors.N300;
  }

  if (p.flat || p.outline) {
    return styledProps(computedThemeStyle.color, 'variant')(p);
  }

  return styledProps(computedThemeStyle.contrastColor, 'variant')(p);
};

const buttonBackground = (p, computedThemeStyle) => {
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

  return styledProps(computedThemeStyle.background, 'variant')(p);
};

const buttonBorder = (p, computedThemeStyle) => {
  if (p.outline && !p.disabled) {
    return `1px solid ${styledProps(computedThemeStyle.borderColor, 'variant')(p)}`;
  }

  if (p.disabled) {
    return 0;
  }

  return `1px solid ${styledProps(computedThemeStyle.borderColor, 'variant')(p)}`;
};

const hoverBackground = (p, computedThemeStyle) => {
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

  return styledProps(computedThemeStyle.hoverBackground, 'variant')(p);
};

const hoverColor = (p, computedThemeStyle) => {
  const { colors } = p.theme;

  if (p.disabled) {
    return colors.N300;
  }

  if (p.flat || p.outline) {
    return styledProps(computedThemeStyle.hoverColor, 'variant')(p);
  }

  return '';
};

const hoverBorderColor = (p, computedThemeStyle) => {
  if (p.disabled) {
    return 0;
  }

  return `1px solid ${styledProps(computedThemeStyle.hoverBorderColor, 'variant')(p)}`;
};

const buttonStyles = props => {
  const computedThemeStyle = props.theme.utils.createThemeStyle(props, defaultThemeStyle);
  const p = Object.assign({ color: 'primary', size: 'md' }, props);

  return `
    align-items: center;
    background: ${buttonBackground(p, computedThemeStyle)};
    border-radius: ${p.circle ? '50%' : '3px'};
    border: ${buttonBorder(p, computedThemeStyle)};
    color: ${buttonColor(p, computedThemeStyle)};
    cursor: ${p.disabled ? 'not-allowed' : 'pointer'};
    display: flex;
    font-size: ${styledProps(computedThemeStyle.fontSize, 'size')(p)};
    height: ${styledProps(computedThemeStyle.size, 'size')(p)};
    justify-content: center;
    outline: none;
    padding-left: ${p.iconBefore || p.circle ? '0' : '1rem'};
    padding-right: ${p.iconAfter || p.loading || p.circle ? '0' : '1rem'};
    text-decoration: none;
    user-select: none;
    width: ${p.block ? '100%' : p.circle ? styledProps(computedThemeStyle.size, 'size')(p) : ''};

    &:hover {
      background: ${hoverBackground(p, computedThemeStyle)};
      color: ${hoverColor(p, computedThemeStyle)};
      border: ${hoverBorderColor(p, computedThemeStyle)};
    }
  `;
};

export default buttonStyles;
