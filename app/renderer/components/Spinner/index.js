import styled, { keyframes } from 'styled-components';
import styledProps from 'styled-props';
import { rgba } from 'polished';
import theme from 'renderer/components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;
  return {
    color: colors.N200,
    size: {
      xs: '10px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '40px',
    },
    thickness: {
      xs: '2px',
      sm: '2px',
      md: '2px',
      lg: '2px',
      xl: '4px',
    },
    speed: '0.7s',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const spinnerRotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: ${p => styledProps(computedThemeStyle(p).size, 'size')(p)};
  height: ${p => styledProps(computedThemeStyle(p).size, 'size')(p)};
  border: ${p =>
    `${styledProps(computedThemeStyle(p).thickness, 'size')(p)} solid ${rgba(
      p.color || computedThemeStyle(p).color,
      0.15
    )}`};
  border-left: ${p => styledProps(computedThemeStyle(p).thickness, 'size')(p)} solid
    ${p => p.color || computedThemeStyle(p).color};
  border-radius: 50%;
  animation: ${spinnerRotate} ${p => computedThemeStyle(p).speed} infinite linear;
`;

Spinner.defaultProps = {
  size: 'md',
  theme,
  themeKey: 'Spinner',
  themeStyle: {},
};

/** @component */
export default Spinner;
