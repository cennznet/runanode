import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import withContainer from './container';

const WalletRestorePage = ({ subNav, onReset }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Restore wallet</PageHeading>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletRestorePage);
