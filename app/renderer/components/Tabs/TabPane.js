import React from 'react';
import styled from 'styled-components';
import { TabPane as RcTabPane } from 'rc-tabs';
import theme from 'components/defaultTheme';
import Scrollable from '../Scrollable';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    tabPaneHeight: '80vh',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const StyledPane = styled(RcTabPane)`
  padding-top: 2rem;
`;

const TabPane = ({ children, withScrollable, ...props }) => (
  <StyledPane {...props}>
    {withScrollable ? (
      <Scrollable styles={{ height: computedThemeStyle(props).tabPaneHeight }} gradientBottom>
        {children}
      </Scrollable>
    ) : (
      children
    )}
  </StyledPane>
);

TabPane.defaultProps = {
  withScrollable: false,
  theme,
  themeKey: 'Tabs',
  themeStyle: {},
};

TabPane.displayName = 'TabPane';

export default TabPane;
