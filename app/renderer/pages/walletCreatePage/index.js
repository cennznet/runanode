import React from 'react';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';

const WalletCreatePage = ({ subNav }) => (
  <Layout defaultTopbar defaultSidebar>
    <LayoutWrapper>
      {subNav}
      <MainContent>wallet create</MainContent>
    </LayoutWrapper>
  </Layout>
);

export default WalletCreatePage;
