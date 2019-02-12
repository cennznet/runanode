import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import theme, { colors } from 'renderer/theme';

const Tooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    font-size: 12px;
    color: ${colors.N0};
    min-width: ${p => p.styles.minWidth};
    max-width: ${p => p.styles.maxWidth};
    padding: 0.5rem;
    opacity: 1;
    transform: none;
    user-select: none;

    &.type-dark {
      background-color: rgba(78, 84, 88, 0.9);

      &.place-bottom {
        &:after {
          border-bottom-color: rgba(78, 84, 88, 0.9);
        }
      }
      &.place-right {
        &:after {
          border-right-color: rgba(78, 84, 88, 0.9);
        }
      }
    }
  }
`;

Tooltip.defaultProps = {
  theme,
  place: 'bottom',
  effect: 'solid',
  styles: {
    minWidth: '0',
  },
};

export default Tooltip;
