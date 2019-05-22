import React, { useEffect, useState } from 'react';

import { Logger } from 'renderer/utils/logging';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner, Scrollable } from 'components';
import { PreDefinedAssetId } from 'common/types/theNode.types';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';
import SavePreferenceSection from './SavePreferenceSection';
import ChangeStakingPreferenceModal from './ChangeStakingPreferenceModal';

const StakingStakePage = ({
  subNav,
  uiState,
  wallets,
  stakingPreference,
  balances,
  onStake,
  onSaveStakingPreferences,
}) => {
  const validatorPreferences = stakingPreference;
  const [stakingOption, setStakingOption] = useState(null);
  const [stakingBalance, setStakingBalance] = useState(null);
  const [cpayStakingBalance, setSpendingBalance] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [sufficientGasFee, setSufficientGasFee] = useState(true);
  const [stakingAccount, setStakingAccount] = useState(null);
  const [stakingWallet, setStakingWallet] = useState(null);
  const [isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen] = useState(false);

  useEffect(() => {
    if (stakingOption) {
      const { value: stakingAccountAddress, wallet } = stakingOption;
      const { accounts } = wallet;

      const stakingAccountObject = accounts[stakingAccountAddress];
      const { assets } = stakingAccountObject;
      const stakingBalanceFromChain =
        (balances[stakingAccountAddress] &&
          balances[stakingAccountAddress][PreDefinedAssetId.stakingToken].freeBalance.toString) ||
        0;
      const cpayStakingBalanceFromChain =
        (balances[stakingAccountAddress] &&
          balances[stakingAccountAddress][PreDefinedAssetId.spendingToken].freeBalance.toString) ||
        0;
      // TODO: estimation code is not ready yet, would hard code first.
      // TODO: make the consistent compare unit
      const sortedGasFee = 27000000;

      const sortedStakingBalance = parseInt(stakingBalanceFromChain, 10);
      const sortedSpendingBalance = parseInt(cpayStakingBalanceFromChain, 10);
      const isSufficientGasFee = sortedSpendingBalance >= sortedGasFee;

      setStakingBalance(sortedStakingBalance);
      setSpendingBalance(sortedSpendingBalance);
      setGasFee(sortedGasFee);
      setSufficientGasFee(isSufficientGasFee);
      setStakingAccount(stakingAccountObject);
      setStakingWallet(wallet);
    }
  }, [stakingOption, balances]);

  const onStakeConfirmed = () =>
    onStake({
      wallet: stakingOption.wallet,
      stashAccountAddress: stakingOption.value,
      passphrase: '',
      stakingPreference,
      balances,
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
        <Scrollable themeStyle={{ height: '70vh' }}>
          <div className="content" style={{ height: '70vh' }}>
            <SelectStakingAccount
              wallets={wallets || []}
              onSelectFn={setStakingOption}
              stakingOption={stakingOption}
            />
            {stakingOption && (
              <StakingAccountBalances
                stakingBalance={stakingBalance}
                cpayStakingBalance={cpayStakingBalance}
                gasFee={gasFee}
                sufficientGasFee={sufficientGasFee}
              />
            )}

            {stakingOption && (
              <SavePreferenceSection
                {...{ validatorPreferences, setChangeStakingPreferenceModalOpen }}
              />
            )}
          </div>
        </Scrollable>
        <PageFooter>
          <div />
          <Stake
            {...{
              onStakeConfirmed,
              stakingBalance,
              cpayStakingBalance,
              gasFee,
              sufficientGasFee,
              stakingAccount,
            }}
          />
        </PageFooter>
      </MainContent>

      <ChangeStakingPreferenceModal
        {...{
          isChangeStakingPreferenceModalOpen,
          setChangeStakingPreferenceModalOpen,
          stakingWallet,
          stakingAccount,
          onSaveStakingPreferences,
          validatorPreferences,
        }}
      />
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
