import theme from 'renderer/theme';
import inputStateStyles from './inputStateStyles';

const inputCoreStyles = (
  p = {
    theme,
    themeSpace: 'input',
  }
) => `
  ${inputStateStyles(p)};

  flex: 1;
  box-sizing: border-box;
  padding-left: ${p.prefix ? '3rem' : '1.25rem'};
  padding-right: ${p.suffix ? '3rem' : '1.25rem'};
  height: ${p.height || '2.5rem'};
  font-size: 14px;
  border-top-left-radius: ${p.prepend ? '0' : '0.2rem'};
  border-bottom-left-radius: ${p.prepend ? '0' : '0.2rem'};
  border-top-right-radius: ${p.append ? '0' : '0.2rem'};
  border-bottom-right-radius: ${p.append ? '0' : '0.2rem'};
`;

export default inputCoreStyles;
