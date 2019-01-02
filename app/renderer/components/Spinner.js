import styled, { keyframes } from 'styled-components';
import { rgba } from 'polished';
import deepAssign from 'deep-assign';
import themeObj from 'renderer/theme';

const defaultStyling = p => {
  const { colors } = p.theme;
  return ({
    color: colors.N500
  });
};

const styling = p => deepAssign({}, defaultStyling(p), p.theme[p.themeSpace], p.themeStyles);

const spinnerRotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: ${p => p.size};
  height: ${p => p.size};
  border: ${p => `${p.thickness} solid ${rgba(p.color || styling(p).color, 0.15)}`};
  border-left: ${p => p.thickness} solid ${p => p.color || styling(p).color};
  border-radius: 50%;
  animation: ${spinnerRotate} ${p => p.speed} infinite linear;
`;

Spinner.defaultProps = {
  size: '12px',
  thickness: '2px',
  speed: '0.7s',
  theme: themeObj,
  themeSpace: 'spinner'
};

export default Spinner;
