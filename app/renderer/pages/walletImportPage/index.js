import React from 'react';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';

const WalletImportPage = ({ subNav }) => (
  <Layout defaultTopbar defaultSidebar>
    <LayoutWrapper>
      {subNav}
      <MainContent>wallet import</MainContent>
    </LayoutWrapper>
  </Layout>
);

export default WalletImportPage;
