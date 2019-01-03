import React from 'react';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';

const WalletCreatePage = () => (
  <Layout sidebar={<SimpleSidebar />}>
    <LayoutWrapper>
      <MainContent>wallet create</MainContent>
    </LayoutWrapper>
  </Layout>
);

export default WalletCreatePage;
