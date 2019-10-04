import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import styled from 'styled-components';
import R from 'ramda';

import PageHeaderWithStakingToggle from 'renderer/pages/staking/PageHeaderWithStakingToggle';
import StakingProgressCard from './StakingProgressCard';
import withContainer from './container';
import ValidatorsList from './ValidatorsList';
import WaitingList from './WaitingList';
import useApis from './useApis';
import { sortedListWithBalances } from '../staking/utils';

const ListsWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
`;

const StakingOverviewPage = props => {
  const {
    isStakingStated,
    subNav,
    onClickStakeButton,
    stakingStashAccountAddress,
    stakingStashWalletId,
    wallets
  } = props;

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

  const stakingWallet =
    wallets && !!wallets.length && R.find(R.propEq('id', stakingStashWalletId))(wallets);
  const stakingAccount = stakingWallet ? stakingWallet.accounts[stakingStashAccountAddress] : '';

  return (
    <MainLayout subNav={subNav}>
      <MainContent>
        <PageHeaderWithStakingToggle
          heading="Staking overview"
          {...{
            intentionsWithBalances,
            isStakingStated,
            onClickStakeButton,
            subHeading,
            stakingWallet,
            stakingAccount
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
