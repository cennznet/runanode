import React from 'react';

import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';

const WalletListPage = () => (
  <MainLayout>
    <MainContent display="flex">
      <PageHeading>Wallet list page</PageHeading>
      <div className="content">content</div>
    </MainContent>
  </MainLayout>
);

export default WalletListPage;
