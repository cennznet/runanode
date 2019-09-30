import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import styled from 'styled-components';
import PageHeaderWithStakingToggle from 'renderer/pages/staking/PageHeaderWithStakingToggle';
import { PreDefinedAssetId } from 'common/types/theNode.types';
import StakingProgressCard from './StakingProgressCard';
import withContainer from './container';
import ValidatorsList from './ValidatorsList';
import WaitingList from './WaitingList';
import useApis from './useApis';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;

const reoderList = (arryList, fromIndex, toIndex = 0) => {
  if (Array.isArray(arryList)) {
    arryList.splice(toIndex, 0, arryList.splice(fromIndex, 1)[0]);
    return arryList;
  }
  return [];
};

const sortedListWithBalances = (accountList, premierAccount, setValueFn) => {
  if (accountList) {
    const index = accountList.indexOf(premierAccount);
    const reoderAccountList = index === -1 ? accountList : reoderList(accountList, index);
    Promise.all(
      reoderAccountList.map(async account => {
        const stakingTokenBalance = await window.appApi.getGenericAssetFreeBalance(
          PreDefinedAssetId.stakingToken,
          account
        );
        return (
          stakingTokenBalance && {
            address: account,
            stakingTokenBalance: stakingTokenBalance.toString(10),
          }
        );
      })
    ).then(result => setValueFn(result));
  }
};

const StakingOverviewPage = props => {
  const { isStakingStated, subNav, onClickStakeButton, stakingStashAccountAddress } = props;

  const [eraProgress, eraLength, sessionProgress, sessionLength, validators, intentions] = useApis(
    'getEraProgress',
    'getEraLength',
    'getSessionProgress',
    'getSessionLength',
    'getValidators',
    'getIntentions'
  );

  /**
   * Can not use withApis in func
   * Otherwise: Rendered more hooks than during the previous render.
   *
   */

  const [intentionsWithBalances, setIntentionsWithBalances] = useState([]);
  const [validatorsWithBalances, setValidatorsWithBalances] = useState([]);

  useEffect(() => {
    const sortedIntentions =
      intentions && validators
        ? intentions.filter(accountId => !validators.find(validatorId => validatorId === accountId))
        : [];

    sortedListWithBalances(sortedIntentions, stakingStashAccountAddress, setIntentionsWithBalances);
    sortedListWithBalances(validators, stakingStashAccountAddress, setValidatorsWithBalances);
  }, [validators, intentions]);

  const subHeading =
    'Here you can view when the next era is, and how your stake is performing amongst other validators.';

  return (
    <MainLayout subNav={subNav}>
      <MainContent>
        <PageHeaderWithStakingToggle
          heading="Staking overview"
          {...{
            intentionsWithBalances,
            isStakingStated,
            onClickStakeButton,
            stakingStashAccountAddress,
            subHeading,
          }}
        />
        <StakingProgressCard
          eraProgress={eraProgress}
          eraLength={eraLength}
          sessionLength={sessionLength}
          sessionProgress={sessionProgress}
        />
        <ListsWrapper>
          <ValidatorsList
            validators={validatorsWithBalances}
            stakingStashAccountAddress={stakingStashAccountAddress}
          />
          <WaitingList
            waitingList={intentionsWithBalances}
            stakingStashAccountAddress={stakingStashAccountAddress}
          />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingOverviewPage);
