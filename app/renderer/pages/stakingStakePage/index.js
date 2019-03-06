import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter } from 'components';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import Stake from './Stake';

const StakingStakePage = ({ subNav, wallets, onStake }) => {
  const [stakingAccount, setStakingAccount] = useState(null);
  console.log('StakingStakePage - wallets', wallets);
  const onStakeConfirmed = () =>
    onStake({
      wallet: wallets[0], // TODO fix by user selected account
      stashAccountAddress: Object.keys(wallets[0].accounts)[0],
      passphrase: '',
    });

  return (
    <MainLayout subNav={subNav}>
      <MainContent display="flex">
        <PageHeading>Start to stake</PageHeading>
        <div className="content">
          <SelectStakingAccount wallets={wallets} onSelectFn={setStakingAccount} />
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
