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

// const CardSummaryWrapper = styled.div`
//   min-height: 3rem;
//   border-radius: 3px;
//   background-color: ${colors.V900};
//   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
//   display: flex;
//   padding: 1rem;
//   flex-direction: column;
// `;

// const CardSummaryTitle = styled.div`
//   display: flex;
//   color: ${colors.textMuted};
//   line-height: 1.5rem;
// `;

// const CardSummary = ({ hint, title, children }) => (
//   <CardSummaryWrapper>
//     <CardSummaryTitle>
//       <div>{title}</div>
//       {hint && <Hint tooltip={{ styles: { maxWidth: '25rem' } }}>{hint}</Hint>}
//     </CardSummaryTitle>
//     <div>{children}</div>
//   </CardSummaryWrapper>
// );

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

const cennzAssetId = '0';
const cpayAssetId = '10';

const StakingAccountBalances = ({ stakingOption }) => {
  const {
    value: stakingAccount,
    wallet: { accounts },
  } = stakingOption;

  const { assets } = accounts[stakingAccount];
  const cennzFreeBalance = assets[cennzAssetId].freeBalance.toString;
  const cpayFreeBalance = assets[cpayAssetId].freeBalance.toString;
  // TODO: estimation code is not ready yet, would hard code first.
  const gasFee = 20;

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
