import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { colors } from 'theme';
import iconCross from 'renderer/assets/icon/cross.svg';

const StyledSVGInline = styled(SVGInline).attrs({
  svg: iconCross,
})`
  svg {
    width: ${p => p.size};
    height: ${p => p.size};
  }
`;

StyledSVGInline.defaultProps = {
  color: colors.N0,
  size: '0.65rem',
};

export default StyledSVGInline;
