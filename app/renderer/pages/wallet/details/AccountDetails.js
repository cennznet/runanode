import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, PageFooter, Tabs, TabPane } from 'components';

const AccountDetails = ({ wallet }) => {
  const publicWalletAddress =
    wallet.wallet.walltAddress || Object.keys(wallet.wallet._accountKeyringMap);

  return (
    <React.Fragment>
      <PageHeading subHeading={`Public Address: ${publicWalletAddress[0]}`}>
        {wallet.name}
      </PageHeading>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Portfolio" key="1">
          <div>tab 1</div>
        </TabPane>
        <TabPane tab="Receive" key="2">
          <div>tab 2</div>
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
};

export default AccountDetails;
