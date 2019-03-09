import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner } from 'components';
import BN from 'bn.js';
import { PreDefinedAssetId } from 'common/types/cennznet-node.types';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';

const cennzAssetId = PreDefinedAssetId.stakingToken;
const cpayAssetId = PreDefinedAssetId.spendingToken;

const StakingStakePage = ({ subNav, uiState, wallets, onStake }) => {
  const [stakingOption, setStakingOption] = useState(null);
  const [cennzFreeBalance, setCennzFreeBalance] = useState(null);
  const [cpayFreeBalance, setCpayFreeBalance] = useState(null);
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
      const sortedCennzFreeBalance = assets[cennzAssetId].freeBalance.toString || 0;
      const sortedCpayFreeBalance = assets[cpayAssetId].freeBalance.toString || 0;
      const sortedGasFee = 10;
      const isSufficientGasFee = parseInt(sortedCpayFreeBalance, 10) >= parseInt(sortedGasFee, 10);

      setCennzFreeBalance(sortedCennzFreeBalance);
      setCpayFreeBalance(sortedCpayFreeBalance);
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
              cennzFreeBalance={cennzFreeBalance}
              cpayFreeBalance={cpayFreeBalance}
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
