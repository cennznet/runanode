import React, { Component } from 'react';
import styled from 'styled-components';
import Layout from './Layout';

import TopBarContainer from './TopBar/TopBarContainer';
import LayoutWrapper from './LayoutWrapper';

const ContentWrapper = styled.div`
  display: flex;
  flex: 1 auto;
`;

const MainLayout = ({ withoutSidebar, subNav, children }) => {
  return (
    <Layout defaultTopBar defaultSidebar={!withoutSidebar}>
      <LayoutWrapper>
        {subNav}
        <ContentWrapper>{children}</ContentWrapper>
      </LayoutWrapper>
    </Layout>
  );
};

export default MainLayout;
