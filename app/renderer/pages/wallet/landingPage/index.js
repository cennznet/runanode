import React from 'react';
import { Link } from 'react-router-dom';
import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import ROUTES from 'renderer/constants/routes';
import withContainer from './container';

const WalletLandingPage = () => (
  // <MainLayout withoutSidebar>
  <MainLayout>
    <MainContent>
      <PageHeading subHeading="You haven't got an active wallet yet. Create a new one, or connect one of your existing ones.">
        Walllet
      </PageHeading>
      <div>
        <Link to={ROUTES.WALLET.CREATE}>Create wallet</Link>
        <br />
        <Link to={ROUTES.WALLET.CONNECT}>Connect wallet</Link>
      </div>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletLandingPage);
