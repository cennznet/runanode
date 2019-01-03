import React from 'react';
import styled from 'styled-components';
import Topbar from './Topbar';
import SideNav from './SideNav';

const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: ${p => (p.hasTopbar ? 'calc(100% - 80px)' : '100%')};
`;

const Content = styled.div`
  background: blue;
  flex: 1 auto;
`;

const Layout = ({ topbar, defaultTopbar, sidebar, defaultSidebar, children }) => (
  <PageWrapper>
    {defaultTopbar ? <Topbar /> : topbar}
    <ContentWrapper hasTopbar={!!topbar || !!defaultTopbar}>
      {defaultSidebar ? <SideNav /> : sidebar}
      <Content>{children}</Content>
    </ContentWrapper>
  </PageWrapper>
);

export default Layout;
