import React from 'react';
import styled from 'styled-components';
import theme, { colors } from 'renderer/theme';
import TopBar from './TopBar';
import SideNav from './SideNav';
import TopBarContainer from './TopBarContainer';

const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: ${p => (p.hasTopBar ? 'calc(100% - 80px)' : '100%')};
  min-height: 40rem;
`;

const Content = styled.div`
  background: ${theme.pageGradient};
  flex: 1 auto;
`;

const Layout = ({ topBar, defaultTopBar, sidebar, defaultSidebar, children }) => (
  <PageWrapper>
    {defaultTopBar ? <TopBarContainer /> : topBar}
    <ContentWrapper hasTopBar={!!topBar || !!defaultTopBar}>
      {defaultSidebar ? <SideNav /> : sidebar}
      <Content>{children}</Content>
    </ContentWrapper>
  </PageWrapper>
);

export default Layout;
