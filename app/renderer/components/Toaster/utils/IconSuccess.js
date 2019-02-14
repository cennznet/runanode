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
      stroke: ${p => `${p.color} !important`};
    }
  }
`;

StyledSVGInline.defaultProps = {
  color: colors.N0,
  size: '1rem',
};

export default StyledSVGInline;
