import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter } from 'components';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import Stake from './Stake';

const StakingStakePage = ({ subNav, wallets, onStake }) => {
  const onStakeConfirmed = () =>
    onStake({
      wallet: wallets[0],
      stashAccountAddress: '5G9w9hVEtzmrb5yuomHRiJxdRkBGWNWWBStw6gJwY82XsAMR',
      passphrase: '',
    });

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
