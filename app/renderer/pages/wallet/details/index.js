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
import AccountPage from './accountPage';

const WalletDetailsPage = ({ wallets, match }) => {
  if (!wallets) {
    return (
      <MainLayout>
        <MainContent display="flex">
          <PageHeading>No wallet Yet...</PageHeading>
        </MainContent>
      </MainLayout>
    );
  }
  const walletId = match.params.id;
  const wallet = R.find(R.propEq('id', walletId))(wallets);
  /**
   * TODO:
   * - Remove the sceond megthod after remove wallet feature ready
   * - List public address dynamic
   *  */
  const publicWalletAddress =
    wallet.wallet.walltAddress || Object.keys(wallet.wallet._accountKeyringMap);

  return (
    <MainLayout subNav={<WalletDetailsSubNav {...{ wallets }} />}>
      <MainContent display="flex">
        <AccountPage {...{ wallet }} />
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletDetailsPage);
