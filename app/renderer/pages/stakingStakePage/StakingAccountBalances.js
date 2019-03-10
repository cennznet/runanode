import React, { useEffect, useState } from 'react';
import { Select, Hint, Ellipsis, Card } from 'components';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from 'renderer/theme';
<<<<<<< HEAD
import ROUTES from 'renderer/constants/routes';
import useApis from '../stakingOverviewPage/useApis';
=======
import { PreDefinedAssetIdName } from 'common/types/cennznet-node.types';
>>>>>>> NODE-105 enhance staking confirm modal

const BalancesWrapper = styled.div`
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
`;

const BalanceDetailsWrapper = styled.div`
  width: 49%;
`;

const StepDescription = styled.div`
  line-height: 1.7rem;
  height: 8rem;
`;

const BalanceDetail = styled.div`
  font-size: 16px;
  line-height: 1.2rem;
  padding: 1rem 0;
  display: flex;
  color: ${p => (p.err ? colors.danger : colors.N0)};
  display: flex;
  flex-direction: column;
`;

const Balance = styled.div`
  font-size: 22px;
  margin-right: 0.5rem;
  display: inline-block;
`;

const InsufficientGasFeeErr = styled.div`
  font-size: 14px;
  margin-right: 1.5rem;
`;

const DespositLink = styled(Link)`
  color: ${colors.N0};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${colors.textHover};
  }
`;

const StakingAccountBalances = ({
  cennzStakingBalance,
  cpayStakingBalance,
  gasFee,
  sufficientGasFee,
}) => {
  return (
    <BalancesWrapper>
      <BalanceDetailsWrapper>
        <StepDescription>
          Step 2: Check the staking amount (CENNZ) All free balance of CENNZ from the account will
          be used for staking, so make sure you have the amount you desire
        </StepDescription>
        <Card
          title="Staking token free balance"
          hint="CENNZ is required to join CENNZNet as Validator, contributing to securing and governing the network."
        >
          <BalanceDetail>
            <div>
              <Ellipsis substrLength={6}>
                <Balance>{cennzStakingBalance}</Balance>
              </Ellipsis>
            {PreDefinedAssetIdName['0']}
            </div>

          </BalanceDetail>
        </Card>
      </BalanceDetailsWrapper>
      <BalanceDetailsWrapper>
        <StepDescription>
          Step 3: Check spending token balance (CENTRAPAY) You need enough CENTRAPAY balance to
          cover estimated total transaction fee. It’s used for staking and unstake.
        </StepDescription>
        <div>
          <Card
            title="Spending token free balance"
            hint="CENTRAPAY is set as base Spending Token for paying network fees to counter attacks like DDos, and as the block reward for validators."
          >
            <BalanceDetail>
              <div>
                <Ellipsis substrLength={6}>
                  <Balance>{cpayStakingBalance}</Balance>
                </Ellipsis>
              {PreDefinedAssetIdName['10']}
              </div>
            </BalanceDetail>
          </Card>
          <Card
            title="Estimated transaction fee (stake + unstake)"
            hint="Transaction fee is paid for maintaining a healthy network utilization."
          >
            <BalanceDetail err={!sufficientGasFee}>
              <div>
                <Ellipsis substrLength={6}>
                  <Balance>{gasFee}</Balance>
                </Ellipsis>
                CENTRAPAY
              </div>
              {!sufficientGasFee && (
                <InsufficientGasFeeErr>
                  You don’t have enough funds to pay transaction fee. You can choose another account
                  or <DespositLink to={ROUTES.WALLET.ROOT}>deposit</DespositLink>
                </InsufficientGasFeeErr>
              )}

            </BalanceDetail>
          </Card>
        </div>
      </BalanceDetailsWrapper>
    </BalancesWrapper>
  );
};

export default StakingAccountBalances;
