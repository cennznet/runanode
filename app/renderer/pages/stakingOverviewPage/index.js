import React, { useEffect } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import withContainer from './container';
import StakingProgressCard from './StakingProgressCard';

const StakingOverviewPage = ({
  subNav,
  onSubscribeStakingData,
  staking: { eraProgress, eraLength, sessionLength, sessionProgress },
}) => {
  useEffect(() => {
    onSubscribeStakingData();
  }, []);

  return (
    <MainLayout subNav={subNav}>
      <MainContent>
        <PageHeading>Staking overview</PageHeading>
        <StakingProgressCard
          eraProgress={eraProgress}
          eraLength={eraLength}
          sessionLength={sessionLength}
          sessionProgress={sessionProgress}
        />
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingOverviewPage);
