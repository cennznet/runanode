import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { CENNZScanAddressUrl } from 'common/types/cennznet-node.types';
import {
  Clipboard,
  PageHeading,
  PageFooter,
  Tabs,
  TabPane,
  Input,
  Ellipsis,
  Hint,
  Tooltip,
} from 'components';
import theme, { colors } from 'theme';
import useOnClickOutside from 'use-onclickoutside';
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
  color: ${colors.textMuted};
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

const NameInput = styled.input`
  background: transparent;
  border: 0;
  color: ${colors.textMuted};
  font-size: 24px;
  padding: 0 0 0.5rem 0;
  autofocus: trye;
  border-bottom: 2px dashed ${colors.V400};
  margin-bottom: 0.5rem;

  &:focus {
    outline-width: 0;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.R500};
  font-size: 12px;
  line-height: 1.2rem;
`;

const AccountName = styled.div`
  max-width: 20rem;
`;

// white-space: nowrap;
// overflow: hidden;
// text-overflow: ellipsis;

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
  const currentAccountId = account.address || '';
  const [accountName, setAccountName] = useState();
  const [isAccountNameEditable, setIsAccountNameEditable] = useState(false);

  useEffect(() => {
    setAccountName(defaultAccountName);
  }, [defaultAccountName]);

  // TODO: Refactor the accounts object in localStorage
  const { accounts = {} } = currentWallet;
  const existingAccountIds = Object.keys(accounts);
  const existingAccountNames = existingAccountIds.length
    ? existingAccountIds.map(accountId => accounts[accountId].name && accounts[accountId].name)
    : [];

  const existingAccountNameErr =
    defaultAccountName !== accountName &&
    existingAccountNames.includes(accountName) &&
    'You’ve already used this account name. Please name it something else.';

  const emptyAccountNameErr = !accountName && 'The account name can not be empty.';

  const AccountNameErr = emptyAccountNameErr || existingAccountNameErr;

  const ref = React.useRef();
  useOnClickOutside(ref, event => {
    if (!existingAccountNameErr) {
      setIsAccountNameEditable(false);
      onUpdateAccountName({
        toUpdateWallet: currentWallet,
        toUpdateAccount: account.address,
        newAccountName: accountName,
      });
    }
  });

  return account ? (
    <React.Fragment>
      <PageHeading subHeading={<Subheading {...{ account }} />}>
        <MainTitleWrapper>
          <AccountNameWrapper>
            {isAccountNameEditable ? (
              <div ref={ref}>
                <NameInput
                  value={accountName}
                  onChange={e => {
                    e.target && setAccountName(e.target.value);
                  }}
                />
                {AccountNameErr && <ErrorMessage>{AccountNameErr}</ErrorMessage>}
              </div>
            ) : (
              <React.Fragment>
                <AccountName>
                  <Ellipsis>{accountName}</Ellipsis>
                </AccountName>
                <Icon
                  icon="pen"
                  color={colors.textMuted}
                  margin="0 0.3rem"
                  onClick={() => setIsAccountNameEditable(true)}
                />
              </React.Fragment>
            )}
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
