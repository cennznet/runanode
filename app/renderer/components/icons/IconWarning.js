import React from 'react';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { colors } from 'theme';
import iconExclamation from 'renderer/assets/icon/exclamation.svg';

import iconExclamationLight from 'renderer/assets/icon/exclamation-light.svg';

const StyledSVGInline = styled(SVGInline).attrs(props => ({
  svg: props.light ? iconExclamationLight : iconExclamation,
}))`
  svg {
    width: ${p => p.size};
    height: ${p => p.size};

    g {
      path {
        stroke: ${p => p.color};
      }

      path:first-child {
        stroke: none;
        fill: ${p => p.color};
      }

      circle {
        fill: ${p => p.color};
      }
    }
  }
`;

const IconWarning = ({ children, light, ...props }) => {
  const svg = light ? iconExclamationLight : iconExclamation;
  return (
    <StyledSVGInline {...props} {...{ svg }}>
      {children}
    </StyledSVGInline>
  );
};

IconWarning.defaultProps = {
  color: colors.V900,
  size: '1.4rem', // 20px
  light: false,
};

export default IconWarning;
