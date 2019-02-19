import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainContent, MainLayout } from 'components/layout';
import { Clipboard, PageHeading, PageFooter, Tabs, TabPane } from 'components';
import PortfolioSection from './PortfolioSection';
import ReceiveSection from './ReceiveSection';
import TransferSection from './transferSectionPage';

const Subheading = ({ account }) => {
  return (
    <div style={{ display: 'flex' }}>
      <span>Public Address: </span>
      <Clipboard>{account.address}</Clipboard>
    </div>
  );
};

const AccountDetails = ({ account, onTransfer, currentWallet, transaction }) => {
  return account ? (
    <React.Fragment>
      <PageHeading subHeading={<Subheading {...{ account }} />}>Account name here...</PageHeading>
      <div className="content">
        <Tabs defaultActiveKey="1" >
          <TabPane tab="Portfolio" key="1" withScrollable>
            <PortfolioSection {...{ account }} />
          </TabPane>
          <TabPane tab="Deposit" key="2" withScrollable>
            <ReceiveSection {...{ account }} />
          </TabPane>
          <TabPane tab="Send" key="3" >
            <TransferSection {...{ account, onTransfer, currentWallet, transaction }} />
          </TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  ) : (
    <PageHeading subHeading="There is no accessible account"> Wallet account </PageHeading>
  );
};

export default AccountDetails;
