import React, { useEffect } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import withContainer from './container';
import StakingProgressCard from './StakingProgressCard';
import ValidatorsList from './ValidatorsList';
import IntentionsList from './IntentionsList';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;

const StakingOverviewPage = ({
  subNav,
  onSubscribeStakingData,
  staking: { eraProgress, eraLength, sessionLength, sessionProgress, validators, intentions },
}) => {
  useEffect(() => {
    onSubscribeStakingData();
  }, []);

  const sortedIntentions =
    intentions && intentions.filter(address => !validators.includes(address));

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
        <ListsWrapper>
          <ValidatorsList validators={validators} />
          <IntentionsList intentions={sortedIntentions} />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingOverviewPage);
