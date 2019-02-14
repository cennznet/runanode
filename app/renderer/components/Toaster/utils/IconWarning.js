import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { colors } from 'renderer/theme';
import iconReady from 'renderer/assets/icon/warning.svg';

const StyledSVGInline = styled(SVGInline).attrs({
  svg: iconReady,
})`
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

StyledSVGInline.defaultProps = {
  color: colors.N700,
  size: '1rem',
};

export default StyledSVGInline;
