import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { CENNZScanAddressUrl } from 'common/types/cennznet-node.types';
import { Clipboard, PageHeading, PageFooter, Tabs, TabPane, Input } from 'components';
import theme, { colors } from 'renderer/theme';
import PortfolioSection from './PortfolioSection';
import ReceiveSection from './ReceiveSection';
import TransferSection from './transferSectionPage';
import ClipboardShareLinks from './transferSectionPage/ClipboardShareLinks';

const MainTitleWrapper = styled.div`
  display: flex;
`;

const AccountNameWrapper = styled.div`
  display: flex;
  align-items: flex-end;
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

const Icon = styled(FontAwesomeIcon)`
  width: 14px;
  height: 14px;
  color: ${p => p.color || colors.N0};
  margin: ${p => p.margin || '0 1rem'};
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
  accountBalances,
  onTransfer,
  currentWallet,
  transaction,
  stakingStashAccountAddress,
  onUpdateAccountName,
}) => {
  const defaultAccountName = account.name || 'Account';
  const [accountName, setAccountName] = useState(defaultAccountName);
  const [isAccountNameEditable, setIsAccountNameEditable] = useState(false);

  const { accounts = {} } = currentWallet;
  const existingAccountIds = Object.keys(accounts);
  const existingAccountNames = existingAccountIds.length
    ? existingAccountIds.map(accountId => accounts[accountId].name && accounts[accountId].name)
    : [];

  const iconPairs =
    !accountName || (isAccountNameEditable && existingAccountNames.includes(accountName))
      ? { icon: 'times', iconColor: colors.R500 }
      : isAccountNameEditable
      ? { icon: 'check', iconColor: colors.G500 }
      : { icon: 'edit', iconColor: colors.N0 };
  const { icon, iconColor } = iconPairs;

  const onClickFunc = () => {
    if (icon === 'edit') {
      setIsAccountNameEditable(true);
    }

    if (icon === 'times') {
      setAccountName(defaultAccountName);
      setIsAccountNameEditable(false);
    }

    if (icon === 'check') {
      setIsAccountNameEditable(false);
      onUpdateAccountName({
        toUpdateWallet: currentWallet,
        toUpdateAccount: account.address,
        newAccountName: accountName,
      });
    }
  };

  return account ? (
    <React.Fragment>
      <PageHeading subHeading={<Subheading {...{ account }} />}>
        <MainTitleWrapper>
          <AccountNameWrapper>
            {isAccountNameEditable ? (
              <Input
                value={accountName}
                onChange={e => e.target && setAccountName(e.target.value)}
                valid={accountName && !existingAccountNames.includes(accountName) ? null : false}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            ) : (
              <div> {defaultAccountName} </div>
            )}

            <div>
              <Icon icon={icon} color={iconColor} onClick={() => onClickFunc()} />
            </div>
          </AccountNameWrapper>
          {stakingStashAccountAddress && stakingStashAccountAddress === account.address && (
            <LockIconWrapper>
              <Icon icon="lock" margin="0.3rem" />
              Your account is staking
            </LockIconWrapper>
          )}
        </MainTitleWrapper>
      </PageHeading>
      <div className="content">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Portfolio" key="1" withScrollable>
            <PortfolioSection {...{ accountBalances }} />
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
