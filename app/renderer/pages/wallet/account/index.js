import React, { useState } from 'react';
import R from 'ramda';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import withContainer from './container';
import WalletDetailsSubNav from './WalletDetailsSubNav';
import AccountDetails from './AccountDetails';

const WalletDetailsPage = ({
  balances,
  wallets,
  stakingStashAccountAddress,
  transaction,
  match,
  onTransfer,
  onUpdateAccountName,
  ...otherProps
}) => {
  const { walletId, accountPublicAddress } = match.params;
  const wallet = wallets && R.find(R.propEq('id', walletId))(wallets);
  return wallet ? (
    <MainLayout
      subNav={
        <WalletDetailsSubNav
          currentWallet={wallet}
          {...{ wallets, stakingStashAccountAddress }}
          {...otherProps}
        />
      }
    >
      <MainContent display="flex">
        <AccountDetails
          key={wallet.accounts[accountPublicAddress]}
          account={wallet.accounts[accountPublicAddress]}
          accountBalances={balances[accountPublicAddress]}
          onTransfer={onTransfer}
          currentWallet={wallet}
          transaction={{ ...transaction }}
          stakingStashAccountAddress={stakingStashAccountAddress}
          onUpdateAccountName={onUpdateAccountName}
        />
      </MainContent>
    </MainLayout>
  ) : (
    <MainLayout>
      <MainContent>
        <PageHeading subHeading="There is no wallet yet, create your own one.">Wallet</PageHeading>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletDetailsPage);
