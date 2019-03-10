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
  // For: errText in AccountBalance component and stake button
  const [sufficientGasFee, setSufficientGasFee] = useState(true);

  useEffect(() => {
    if (stakingOption) {
      const {
        value: stakingAccount,
        wallet: { accounts },
      } = stakingOption;
      const { assets } = accounts[stakingAccount];
      const cennzStakingBalanceFromChain = assets[cennzAssetId].freeBalance.toString || 0;
      const cpayStakingBalanceFromChain = assets[cpayAssetId].freeBalance.toString || 0;
      // TODO: fetch estimated gas fee from chain
      const sortedGasFee = 334;

      const sortedCennzStakingBalance = parseInt(cennzStakingBalanceFromChain, 10);
      const sortedCpayStakingBalance = parseInt(cpayStakingBalanceFromChain, 10);
      const isSufficientGasFee = sortedCpayStakingBalance >= sortedGasFee;

      setCennzStakingBalance(sortedCennzStakingBalance);
      setCpayStakingBalance(sortedCpayStakingBalance);
      setGasFee(sortedGasFee);
      setSufficientGasFee(isSufficientGasFee);
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
          <Stake {...{ onStakeConfirmed }} />
        </PageFooter>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
