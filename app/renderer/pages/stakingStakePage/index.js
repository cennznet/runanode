import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner } from 'components';
import BN from 'bn.js';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';

const cennzAssetId = '0';
const cpayAssetId = '10';

const StakingStakePage = ({ subNav, uiState, wallets, onStake }) => {
  const [stakingOption, setStakingOption] = useState(null);
  const [cennzFreeBalance, setCennzFreeBalance] = useState(null);
  const [cpayFreeBalance, setCpayFreeBalance] = useState(null);
  const [gasFee, setGasFee] = useState(null);

  useEffect(() => {
    if (stakingOption) {
      const {
        value: stakingAccount,
        wallet: { accounts },
      } = stakingOption;
      const { assets } = accounts[stakingAccount];
      const sortedCennzFreeBalance = assets[cennzAssetId].freeBalance.toString || 0;
      const sortedCpayFreeBalance = assets[cpayAssetId].freeBalance.toString || 0;
      // TODO: estimation code is not ready yet, would hard code first.
      // TODO: make the consistent compare unit
      const sortedGasFee = 0;

      setCennzFreeBalance(sortedCennzFreeBalance);
      setCpayFreeBalance(sortedCpayFreeBalance);
      setGasFee(sortedGasFee);
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
