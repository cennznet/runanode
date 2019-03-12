import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { CENNZScanAddressUrl } from 'common/types/cennznet-node.types';
import { Clipboard, PageHeading, PageFooter, Tabs, TabPane } from 'components';
import theme from 'renderer/theme';
import PortfolioSection from './PortfolioSection';
import ReceiveSection from './ReceiveSection';
import TransferSection from './transferSectionPage';
import ClipboardShareLinks from './transferSectionPage/ClipboardShareLinks';

const MainTitleWrapper = styled.div`
  display: flex;
`;

const LockIconWrapper = styled.div`
  margin-left: 0.5rem;
  background: ${theme.listitemHighlightGradient};
  min-width: 2.4rem;
  border-radius: 1rem;
  height: 1.6rem;
  display: flex;
  font-size: 10px;
  align-items: center;
`;

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
        }}
      >
        {account.address}
      </ClipboardShareLinks>
    </div>
  );
};

const AccountDetails = ({
  account,
  onTransfer,
  currentWallet,
  transaction,
  stakingStashAccountAddress,
}) => {
  return account ? (
    <React.Fragment>
      <PageHeading subHeading={<Subheading {...{ account }} />}>
        <MainTitleWrapper>
          {account.name || 'Account name here...'}
          {stakingStashAccountAddress && stakingStashAccountAddress === account.address && (
            <LockIconWrapper>
              <FontAwesomeIcon
                icon="lock"
                style={{ margin: '0.3rem', width: '14px', height: '14px' }}
              />
              Your account is staking
            </LockIconWrapper>
          )}
        </MainTitleWrapper>
      </PageHeading>
      <div className="content">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Portfolio" key="1" withScrollable>
            <PortfolioSection {...{ account }} />
          </TabPane>
          <TabPane tab="Deposit" key="2" withScrollable>
            <ReceiveSection {...{ account }} />
          </TabPane>
          <TabPane tab="Send" key="3">
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
