import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import ROUTES from 'renderer/constants/routes';
import withContainer from './container';
import WalletDetailsSubNav from './WalletDetailsSubNav';
import AccountDetails from './AccountDetails';

const WalletDetailsPage = ({ wallets, match }) => {
  const { walletId, accountPublicAddress } = match.params;
  const wallet = R.find(R.propEq('id', walletId))(wallets);
  return (
    <MainLayout subNav={<WalletDetailsSubNav {...{ wallets }} />}>
      <MainContent display="flex">
        <AccountDetails account={wallet.accounts[accountPublicAddress]} />
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletDetailsPage);
