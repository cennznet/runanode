import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import withContainer from './container';

const StakingOverviewPage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Staking overview</PageHeading>
      <div>overview</div>
    </MainContent>
  </MainLayout>
);

export default withContainer(StakingOverviewPage);
