import React, { useEffect } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import withContainer from './container';
import StakingProgressCard from './StakingProgressCard';
import ValidatorsList from './ValidatorsList';
import IntentionsList from './IntentionsList';
import withApis from './withApis';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;
// eraProgress, eraLength, sessionLength, sessionProgress,
const StakingOverviewPage = ({
  subNav,
  onSubscribeStakingData,
  // staking: { validators, intentions },
}) => {
  // useEffect(() => {
  //   onSubscribeStakingData();
  // }, []);

  const [eraProgress, eraLength, sessionProgress, sessionLength, validators, intentions] = withApis(
    'getEraProgress',
    'getEraLength',
    'getSessionProgress',
    'getSessionLength',
    'getValidators',
    'getIntentions'
  );

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
          <ValidatorsList validators={validators || []} />
          <IntentionsList intentions={sortedIntentions || []} />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingOverviewPage);
