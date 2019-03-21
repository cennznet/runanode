import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner, Scrollable } from 'components';
import { PreDefinedAssetId } from 'common/types/cennznet-node.types';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';
import SavePreferenceSection from './SavePreferenceSection';
import ChangeStakingPreferenceModal from './ChangeStakingPreferenceModal';

const cennzAssetId = PreDefinedAssetId.stakingToken;
const cpayAssetId = PreDefinedAssetId.spendingToken;

const StakingStakePage = ({ subNav, uiState, wallets, stakingPreference, balances, onStake, onSaveStakingPreferences }) => {
  const validatorPreferences = stakingPreference;
  const [stakingOption, setStakingOption] = useState(null);
  const [cennzStakingBalance, setCennzStakingBalance] = useState(null);
  const [cpayStakingBalance, setCpayStakingBalance] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [sufficientGasFee, setSufficientGasFee] = useState(true);
  const [stakingAccount, setStakingAccount] = useState(null);
  const [stakingWallet, setStakingWallet] = useState(null);
  const [isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen] = useState(false);

  useEffect(() => {
    if (stakingOption) {
      const {
        value: stakingAccountAddress,
        wallet,
      } = stakingOption;
      const { accounts } = wallet; // TODO fix this Cherry, incorrect spending token free balance

      const stakingAccountObject = accounts[stakingAccountAddress];
      const { assets } = stakingAccountObject;
      const cennzStakingBalanceFromChain = assets[cennzAssetId].freeBalance.toString || 0;
      const cpayStakingBalanceFromChain = assets[cpayAssetId].freeBalance.toString || 0;
      // TODO: estimation code is not ready yet, would hard code first.
      // TODO: make the consistent compare unit
      const sortedGasFee = 334;

      const sortedCennzStakingBalance = parseInt(cennzStakingBalanceFromChain, 10);
      const sortedCpayStakingBalance = parseInt(cpayStakingBalanceFromChain, 10);
      const isSufficientGasFee = sortedCpayStakingBalance >= sortedGasFee;

      setCennzStakingBalance(sortedCennzStakingBalance);
      setCpayStakingBalance(sortedCpayStakingBalance);
      setGasFee(sortedGasFee);
      setSufficientGasFee(isSufficientGasFee);
      setStakingAccount(stakingAccountObject);
      setStakingWallet(wallet);
    }
  }, [stakingOption]);

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
        <Scrollable styles={{height: '70vh'}}>
          <div className="content" style={{height: '70vh'}}>
            <SelectStakingAccount
              wallets={wallets || []}
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

            {stakingOption && (
            <SavePreferenceSection {...{ validatorPreferences, setChangeStakingPreferenceModalOpen }} />
            )}
          </div>
        </Scrollable>
        <PageFooter>
          <div/>
          <Stake
            {...{
              onStakeConfirmed,
              cennzStakingBalance,
              cpayStakingBalance,
              gasFee,
              sufficientGasFee,
              stakingAccount,
            }}
          />
        </PageFooter>
      </MainContent>

      <ChangeStakingPreferenceModal {...{
        isChangeStakingPreferenceModalOpen,
        setChangeStakingPreferenceModalOpen,
        stakingWallet,
        stakingAccount,
        onSaveStakingPreferences,
        validatorPreferences,
      }} />
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
