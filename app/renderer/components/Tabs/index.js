import React from 'react';
import styled from 'styled-components';
import RcTabs from 'rc-tabs';
import 'rc-tabs/assets/index.css';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    activeColor: colors.text,
    color: colors.textMuted,
    inkBarActiveColor: colors.primary,
    inkBarColor: 'rgba(255, 255, 255, 0.3)',
    maxHeight: '100%',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const StyledTabs = styled(RcTabs)`
  &.rc-tabs {
    max-height: ${p => computedThemeStyle(p).maxHeight};
    border-bottom: 0;

    .rc-tabs-bar {
      user-select: none;
      border-bottom: ${p => `1px solid ${computedThemeStyle(p).inkBarColor}`};

      .rc-tabs-nav-container {
        line-height: 2.5;
      }

      .rc-tabs-tab {
        margin-right: 0;
        color: ${p => computedThemeStyle(p).color};
        padding: 4px 14px;

        &-active {
          font-weight: 600;
          color: ${p => computedThemeStyle(p).activeColor};
        }
      }

      .rc-tabs-nav {
        border-bottom: 0;
      }

      .rc-tabs-ink-bar {
        background: ${p => computedThemeStyle(p).inkBarActiveColor};
        bottom: -1px;
        z-index: 0;
      }
    }
  }
`;

const Tabs = ({ children, ...props }) => (
  <StyledTabs
    renderTabBar={() => <ScrollableInkTabBar />}
    renderTabContent={() => <TabContent />}
    {...props}
  >
    {children}
  </StyledTabs>
);

Tabs.defaultProps = {
  theme,
  themeKey: 'Tabs',
  themeStyle: {},
};

Tabs.displayName = 'Tabs';

/** @component */
export default Tabs;
