import React from 'react';
import styled from 'styled-components';
import RcTabs from 'rc-tabs';
import 'rc-tabs/assets/index.css';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import { colors } from 'renderer/theme';

const StyledTabs = styled(RcTabs)`
  &.rc-tabs {
    max-height: ${p => p.styles.maxHeight};
    border-bottom: 0;

    .rc-tabs-bar {
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .rc-tabs-nav-container {
        line-height: 2.5;
      }

      .rc-tabs-tab {
        margin-right: 0;
        color: ${colors.textMuted};
        padding: 4px 14px;

        &-active {
          font-weight: 600;
          color: ${colors.text};
        }
      }

      .rc-tabs-nav {
        border-bottom: 0;
      }

      .rc-tabs-ink-bar {
        background-color: ${colors.primary};
        bottom: -1px;
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
  styles: {
    maxHeight: '100%',
  },
};

export default Tabs;
