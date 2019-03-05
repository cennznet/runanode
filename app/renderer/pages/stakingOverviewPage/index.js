import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import StakingProgressCard from './StakingProgressCard';
import ValidatorsList from './ValidatorsList';
import IntentionsList from './IntentionsList';
import useApis from './useApis';
import useApi from './useApi';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;

const StakingOverviewPage = ({ subNav }) => {
  const [
    eraProgress,
    eraLength,
    sessionProgress,
    sessionLength,
    validators,
    intentions,
    // freeBalances,
  ] = useApis(
    'getEraProgress',
    'getEraLength',
    'getSessionProgress',
    'getSessionLength',
    'getValidators',
    'getIntentions'
    // Working Exmaple
    // [
    //   'getGenericAssetFreeBalance',
    //   { noSubscription: true, params: ['0', '5FPGbDkvDaRDQTzqzs87PjLxDbM98p9hph3wp3KceiikF6Sy'] },
    // ]
  );

  /**
   * Can not use withApis in func
   * Otherwise: Rendered more hooks than during the previous render.
   *
   */

  const getBalance = async address =>
    await window.odin.api.cennz.getGenericAssetFreeBalance('0', address);

  // const [intentionsBalances, SetIntentionsBalances] = useState([]);
  // useEffect(() => {
  //   if (intentions) {
  //     const sortedIntentions = intentions.reduce(async (result, currentIntention) => {
  //       const cennzBalance = await window.odin.api.cennz.getGenericAssetFreeBalance(
  //         '0',
  //         currentIntention
  //       );
  //       console.log('cennzBalance', cennzBalance);
  //       console.log('result', result);
  //       return result && result.concat({ address: cennzBalance });
  //     }, []);
  //     console.log('lolo', sortedIntentions);
  //   }
  // }, [intentions]);

  // TODO: Reorder the validator List with staking account
  const sortedValidators = validators || [];

  // TODO: Reorder the intentions List with staking account
  const sortedIntentions = intentions
    ? intentions.filter(address => !sortedValidators.includes(address))
    : [];

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
          <ValidatorsList validators={sortedValidators} />
          <IntentionsList intentions={sortedIntentions} />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default StakingOverviewPage;
