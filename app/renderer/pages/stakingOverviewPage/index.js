import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, Button } from 'components';
import styled from 'styled-components';

import theme from 'renderer/theme';
import { PreDefinedAssetId } from 'common/types/cennznet-node.types';
import StakingProgressCard from './StakingProgressCard';
import withContainer from './container';
import ValidatorsList from './ValidatorsList';
import WaitingList from './WaitingList';
import useApis from './useApis';
import useApi from './useApi';

const PageTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NextUpHintText = styled.div`
  font-size: 10px;
  background: ${theme.listitemHighlightGradient};
  border-radius: 12px;
  height: 1.2rem;
  line-height: 1.2rem;
  margin-left: 0.5rem;
`;

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

const StakingOverviewPage = ({ subNav, onClickStakeButton, stakingStashAccountAddress }) => {
  const [eraProgress, eraLength, sessionProgress, sessionLength, validators, intentions] = useApis(
    'getEraProgress',
    'getEraLength',
    'getSessionProgress',
    'getSessionLength',
    'getValidators',
    'getValidators' // TODO: Confirm whether intentions concept still exist
  );

  /**
   * Can not use withApis in func
   * Otherwise: Rendered more hooks than during the previous render.
   *
   */

  const [intentionsWithBalances, setIntentionsWithBalances] = useState(null);
  useEffect(() => {
    if (intentions) {
      const index = intentions.indexOf(stakingStashAccountAddress);
      const reoderIntentions = index === -1 ? intentions : reoderList(intentions, index);

      Promise.all(
        reoderIntentions.map(async intention => {
          const cennzBalance = await window.appApi.getGenericAssetFreeBalance(
            PreDefinedAssetId.stakingToken,
            intention
          );
          return cennzBalance && { address: intention, cennzBalance: cennzBalance.toString(10) };
        })
      ).then(result => setIntentionsWithBalances(result));
    }
  }, [intentions]);

  const sortedValidators =
    intentionsWithBalances && validators
      ? intentionsWithBalances.filter(intentionWithBalance =>
          validators.includes(intentionWithBalance.address)
        )
      : [];

  const sortedWaitingList = intentionsWithBalances
    ? intentionsWithBalances.filter(
        intentionWithBalance => !sortedValidators.includes(intentionWithBalance)
      )
    : [];

  const toShowNextUpHintText =
    sortedWaitingList.filter(waitingUser => waitingUser.address === stakingStashAccountAddress)
      .length > 0;

  return (
    <MainLayout subNav={subNav}>
      <MainContent>
        <PageHeading subHeading="Here you can view when the next era is, and how your stake is performing amongst other validators.">
          <PageTitleWrapper>
            <TextTitleWrapper>
              <div>Staking overview</div>
              {toShowNextUpHintText && (
                <NextUpHintText>You will join validator list from next era</NextUpHintText>
              )}
            </TextTitleWrapper>
            <Button style={{display: stakingStashAccountAddress ? 'none' : 'block'}} size="lg" onClick={() => onClickStakeButton()}>
              Stake
            </Button>
          </PageTitleWrapper>
        </PageHeading>
        <StakingProgressCard
          eraProgress={eraProgress}
          eraLength={eraLength}
          sessionLength={sessionLength}
          sessionProgress={sessionProgress}
        />
        <ListsWrapper>
          <ValidatorsList
            validators={sortedValidators}
            stakingStashAccountAddress={stakingStashAccountAddress}
          />
          <WaitingList
            waitingList={sortedWaitingList}
            stakingStashAccountAddress={stakingStashAccountAddress}
          />
        </ListsWrapper>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingOverviewPage);
