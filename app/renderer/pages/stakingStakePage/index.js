import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import withContainer from './container';

const StakingStakePage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Stake</PageHeading>
      <div>stake</div>
    </MainContent>
  </MainLayout>
);

export default withContainer(StakingStakePage);
