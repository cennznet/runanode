import React from 'react';

import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';

const WalletImportPage = () => (
  // <MainLayout withoutSidebar>
  <MainLayout>
    <MainContent display="flex">
      <PageHeading subHeading="This is sub heading">Connect walllet</PageHeading>
      <div className="content">content</div>
      <PageFooter>
        <StartOverLink />
        <Button>Next</Button>
      </PageFooter>
    </MainContent>
  </MainLayout>
);

export default WalletImportPage;
