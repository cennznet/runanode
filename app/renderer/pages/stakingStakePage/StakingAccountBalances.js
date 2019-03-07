import React, { useEffect, useState } from 'react';
import { Select, Hint, Ellipsis, Card } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import useApis from '../stakingOverviewPage/useApis';

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
`;

const Balance = styled.div`
  font-size: 22px;
  margin-right: 0.5rem;
`;

const StakingAccountBalances = ({ cennzFreeBalance, cpayFreeBalance, gasFee }) => {
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
            <Ellipsis substrLength={6}>
              <Balance>{cennzFreeBalance} </Balance>
            </Ellipsis>
            Cennz
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
              <Ellipsis substrLength={6}>
                <Balance>{cpayFreeBalance} </Balance>
              </Ellipsis>
              CENTRAPAY
            </BalanceDetail>
          </Card>
          <Card
            title="Estimated transaction fee (stake + unstake)"
            hint="Transaction fee is paid for maintaining a healthy network utilization."
          >
            <BalanceDetail>
              <Ellipsis substrLength={6}>
                <Balance>{gasFee} </Balance>
              </Ellipsis>
              CENTRAPAY
            </BalanceDetail>
          </Card>
        </div>
      </BalanceDetailsWrapper>
    </BalancesWrapper>
  );
};

export default StakingAccountBalances;
