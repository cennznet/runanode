import styledProps from 'styled-props';
import defaultThemeStyle from './defaultThemeStyle';
import inputStateStyles from './inputStateStyles';

const inputCoreStyles = props => {
  const computedThemeStyle = props.theme.utils.createThemeStyle(props, defaultThemeStyle);
  const p = Object.assign({ computedThemeStyle }, props);

  return `
  ${inputStateStyles(p)};

  flex: 1;
  box-sizing: border-box;
  padding-left: ${p.prefix ? '3rem' : '1rem'};
  padding-right: ${p.suffix ? '3rem' : '1rem'};
  height: ${styledProps(computedThemeStyle.size, 'size')(p)};
  font-size: 14px;
  border-top-left-radius: ${p.prepend ? '0' : '0.2rem'};
  border-bottom-left-radius: ${p.prepend ? '0' : '0.2rem'};
  border-top-right-radius: ${p.append ? '0' : '0.2rem'};
  border-bottom-right-radius: ${p.append ? '0' : '0.2rem'};
`;
};

export default inputCoreStyles;
