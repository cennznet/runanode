import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter } from 'components';
import withContainer from './container';

const WalletAccountPage = ({ wallet }) => {
  const publicWalletAddress =
    wallet.wallet.walltAddress || Object.keys(wallet.wallet._accountKeyringMap);

  return (
    <React.Fragment>
      <PageHeading subHeading={`Public Address: ${publicWalletAddress[0]}`}>
        {wallet.name}
      </PageHeading>
    </React.Fragment>
  );
};

export default withContainer(WalletAccountPage);
