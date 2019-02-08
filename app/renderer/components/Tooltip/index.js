import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import theme from 'renderer/theme';

const Tooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    font-size: 12px;
    opacity: 1;
    transform: none;

    &.type-dark {
      background-color: ${p => p.theme.colors.N800};

      &.place-bottom {
        &:after {
          border-bottom-color: ${p => p.theme.colors.N800};
        }
      }
    }
  }
`;

Tooltip.defaultProps = {
  theme,
  place: 'bottom',
  effect: 'solid',
};

export default Tooltip;
