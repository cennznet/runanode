import React, { useEffect } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import StakingProgressCard from './StakingProgressCard';
import ValidatorsList from './ValidatorsList';
import IntentionsList from './IntentionsList';
import useApis from './useApis';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;

const StakingOverviewPage = ({ subNav }) => {
  const [eraProgress, eraLength, sessionProgress, sessionLength, validators, intentions] = useApis(
    'getEraProgress',
    'getEraLength',
    'getSessionProgress',
    'getSessionLength',
    'getValidators',
    'getIntentions'
  );

  const sortedIntentions =
    validators && intentions && intentions.filter(address => !validators.includes(address));

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
          <ValidatorsList validators={validators || []} />
          <IntentionsList intentions={sortedIntentions || []} />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default StakingOverviewPage;
