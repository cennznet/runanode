import React from 'react';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';

const WalletRestorePage = ({ subNav }) => (
  <Layout defaultTopbar defaultSidebar>
    <LayoutWrapper>
      {subNav}
      <MainContent>wallet restore</MainContent>
    </LayoutWrapper>
  </Layout>
);

export default WalletRestorePage;
