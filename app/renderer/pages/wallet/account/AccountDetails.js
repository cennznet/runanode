import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CENNZScanAddressUrl } from 'common/types/cennznet-node.types';
import { Clipboard, PageHeading, PageFooter, Tabs, TabPane } from 'components';
import PortfolioSection from './PortfolioSection';
import ReceiveSection from './ReceiveSection';
import TransferSection from './transferSectionPage';
import ClipboardShareLinks from './transferSectionPage/ClipboardShareLinks';

const Subheading = ({ account }) => {
  const url = CENNZScanAddressUrl.rimu; // TODO should base on selected network
  return (
    <div style={{ display: 'flex' }}>
      <span>Public Address: </span>
      <ClipboardShareLinks
        url={url}
        styles={{
          height: '1rem',
          lineHeight: '1rem',
          padding: null,
          backgroundColor: null,
          textDecoration: null,
          icon2MarginLeft: '1rem',
          textPaddingTop: null,
          textMinWidth: null,
        }}>{account.address}
      </ClipboardShareLinks>
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
