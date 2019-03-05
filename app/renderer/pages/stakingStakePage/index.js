import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, PageSpinner } from 'components';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import Stake from './Stake';

const StakingStakePage = ({ subNav, uiState, wallets, onStake }) => {
  const onStakeConfirmed = () =>
    onStake({
      wallet: wallets[0], // TODO fix by user selected account
      stashAccountAddress: Object.keys(wallets[0].accounts)[0],
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
        <PageHeading subHeading="Declare the desire to stake for the transactor. Effects will be executed at the beginning of the next era.">
          Start to stake
        </PageHeading>
        <div className="content">
          <SelectStakingAccount />
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
