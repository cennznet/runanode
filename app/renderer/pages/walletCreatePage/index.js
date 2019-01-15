import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import withContainer from './container';

const WalletCreatePage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Create walllet</PageHeading>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletCreatePage);
