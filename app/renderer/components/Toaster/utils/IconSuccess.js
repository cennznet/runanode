import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { colors } from 'renderer/theme';
import iconTick from 'renderer/assets/icon/tick.svg';

const StyledSVGInline = styled(SVGInline).attrs({
  svg: iconTick,
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
    }
  }
`;

StyledSVGInline.defaultProps = {
  color: colors.N0,
  size: '1.4rem', // 20px
};

export default StyledSVGInline;
