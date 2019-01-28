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

  const navItems =
    wallets &&
    wallets.map(x => ({
      title: x.name,
      link: `${ROUTES.WALLET.DETAILS}/${x.id}`,
    }));

  return (
    <MainLayout subNav={<WalletDetailsSubNav {...{ wallets }} />}>
      <MainContent display="flex">
        <PageHeading subHeading={`Id: ${wallet.id}`}>{wallet.name}</PageHeading>
        <div className="content">.</div>
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletDetailsPage);
