import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    background: '#A99DFF',
    color: colors.V900,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const Tooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    font-size: 12px;
    color: ${p => computedThemeStyle(p).color};
    min-width: ${p => computedThemeStyle(p).minWidth};
    max-width: ${p => computedThemeStyle(p).maxWidth};
    padding: 0.5rem;
    opacity: 1;
    transform: none;
    user-select: none;

    &.type-dark {
      background: ${p => computedThemeStyle(p).background};

      &.place-bottom {
        &:after {
          border-bottom-color: ${p => computedThemeStyle(p).background};
        }
      }
      &.place-right {
        &:after {
          border-right-color: ${p => computedThemeStyle(p).background};
        }
      }
    }
  }
`;

Tooltip.defaultProps = {
  place: 'bottom',
  effect: 'solid',
  theme,
  themeKey: 'Tooltip',
  themeStyle: {
    minWidth: '0',
  },
};

export default Tooltip;
