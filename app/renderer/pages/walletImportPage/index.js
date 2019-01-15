import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';

const WalletImportPage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Import wallet</PageHeading>
    </MainContent>
  </MainLayout>
);

export default WalletImportPage;
