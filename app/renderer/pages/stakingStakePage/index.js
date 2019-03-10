import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner } from 'components';
import { PreDefinedAssetId } from 'common/types/cennznet-node.types';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';

const cennzAssetId = PreDefinedAssetId.stakingToken;
const cpayAssetId = PreDefinedAssetId.spendingToken;

const StakingStakePage = ({ subNav, uiState, wallets, onStake }) => {
  const [stakingOption, setStakingOption] = useState(null);
  const [cennzStakingBalance, setCennzStakingBalance] = useState(null);
  const [cpayStakingBalance, setCpayStakingBalance] = useState(null);
  const [gasFee, setGasFee] = useState(null);
<<<<<<< HEAD
  // For: errText in AccountBalance component and stake button
  const [sufficientGasFee, setSufficientGasFee] = useState(true);
=======
  const [stakingAccount, setStakingAccount] = useState(null);
>>>>>>> NODE-105 enhance staking confirm modal

  useEffect(() => {
    if (stakingOption) {
      const {
        value: stakingAccountAddress,
        wallet: { accounts },
      } = stakingOption;
<<<<<<< HEAD
      const { assets } = accounts[stakingAccount];
      const cennzStakingBalanceFromChain = assets[cennzAssetId].freeBalance.toString || 0;
      const cpayStakingBalanceFromChain = assets[cpayAssetId].freeBalance.toString || 0;
      // TODO: fetch estimated gas fee from chain
      const sortedGasFee = 334;
=======
      const stakingAccountObject = accounts[stakingAccountAddress];
      const { assets } = stakingAccountObject;
      const sortedCennzFreeBalance = assets[cennzAssetId].freeBalance.toString || 0;
      const sortedCpayFreeBalance = assets[cpayAssetId].freeBalance.toString || 0;
      // TODO: estimation code is not ready yet, would hard code first.
      // TODO: make the consistent compare unit
      const sortedGasFee = 0;
>>>>>>> NODE-105 enhance staking confirm modal

      const sortedCennzStakingBalance = parseInt(cennzStakingBalanceFromChain, 10);
      const sortedCpayStakingBalance = parseInt(cpayStakingBalanceFromChain, 10);
      const isSufficientGasFee = sortedCpayStakingBalance >= sortedGasFee;

      setCennzStakingBalance(sortedCennzStakingBalance);
      setCpayStakingBalance(sortedCpayStakingBalance);
      setGasFee(sortedGasFee);
<<<<<<< HEAD
      setSufficientGasFee(isSufficientGasFee);
=======
      setStakingAccount(stakingAccountObject);
>>>>>>> NODE-105 enhance staking confirm modal
    }
  }, [stakingOption]);

  const onStakeConfirmed = () =>
    onStake({
      wallet: stakingOption.wallet,
      stashAccountAddress: stakingOption.value,
      passphrase: '',
    });

  if (uiState.isProcessing) {
    return (
      <MainLayout subNav={subNav}>
        <MainContent display="flex">
          <PageSpinner message={uiState.message} />
        </MainContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout subNav={subNav}>
      <MainContent display="flex">
        <PageHeading>Start to stake</PageHeading>
        <div className="content">
          <SelectStakingAccount
            wallets={wallets}
            onSelectFn={setStakingOption}
            stakingOption={stakingOption}
          />
          {stakingOption && (
            <StakingAccountBalances
              cennzStakingBalance={cennzStakingBalance}
              cpayStakingBalance={cpayStakingBalance}
              gasFee={gasFee}
              sufficientGasFee={sufficientGasFee}
            />
          )}
        </div>
        <PageFooter>
          <div />
          <Stake
            {...{ onStakeConfirmed, cennzFreeBalance, cpayFreeBalance, gasFee, stakingAccount }}
          />
        </PageFooter>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
