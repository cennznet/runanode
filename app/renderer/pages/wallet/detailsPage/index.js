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

const WalletDetailsPage = ({ wallets, match }) => {
  const walletId = match.params.id;
  const wallet = R.find(R.propEq('id', walletId))(wallets);
  const publicWalletAddress = wallet.wallet && Object.keys(wallet.wallet._accountKeyringMap)[0];

  return (
    <MainLayout subNav={<WalletDetailsSubNav {...{ wallets }} />}>
      <MainContent display="flex">
        <PageHeading subHeading={`Public Address: ${publicWalletAddress}`}>
          {wallet.name}
        </PageHeading>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletDetailsPage);
