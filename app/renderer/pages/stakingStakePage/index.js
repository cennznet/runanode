import React, { useEffect, useState } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter } from 'components';
import withContainer from './container';
import SelectStakingAccount from './SelectStakingAccount';
import StakingAccountBalances from './StakingAccountBalances';
import Stake from './Stake';

const StakingStakePage = ({ subNav, wallets, onStake }) => {
  const [stakingOption, setStakingOption] = useState(null);
  const onStakeConfirmed = () =>
    onStake({
      wallet: wallets[0], // TODO fix by user selected account
      stashAccountAddress: Object.keys(wallets[0].accounts)[0],
      passphrase: '',
    });

  console.log('wallets', wallets);
  console.log('StakingStakePage', stakingOption);

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
          {stakingOption && <StakingAccountBalances stakingAccount={stakingOption.value} />}
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
