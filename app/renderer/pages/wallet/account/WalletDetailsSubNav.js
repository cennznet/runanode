import React, { useState } from 'react';
import R from 'ramda';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubNav, CollapsibleMenu } from 'components/layout';
import { Button } from 'components';
import ROUTES from 'renderer/constants/routes';
import history from 'renderer/history';
import { WALLET_TYPE } from 'renderer/constants/wallet';
import AddAccountModal from './AddAccountModal';

const tooltipId = uuid();

const IconPlus = () => (
  <FontAwesomeIcon icon="plus" style={{ marginLeft: '0.5rem', width: '14px', height: '14px' }} />
);

const footer = (
  <Button onClick={() => history.push(ROUTES.WALLET.LANDING)} block>
    <span>Add wallet</span>
    <IconPlus />
  </Button>
);

const AddAccountButtonWrapper = styled.div`
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WalletDetailsSubNav = ({
  wallets,
  currentWallet,
  onAddAccount,
  setNewAccount,
  stakingStashAccountAddress,
  ...otherProps
}) => {
  const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [toUpdateWallet, setToUpdateWallet] = useState(false);

  const addAccountButton = wallet => {
    if (wallet.type === WALLET_TYPE.SIMPLE) {
      return null;
    }

    return (
      <AddAccountButtonWrapper>
        <Button
          variant="secondary"
          size="lg"
          block
          onClick={() => {
            setToUpdateWallet(wallet);
            setAddAccountModalOpen(true);
          }}
        >
          <span>Add account</span>
          <IconPlus />
        </Button>
      </AddAccountButtonWrapper>
    );
  };

  const menuList = wallets.map(wallet => {
    return {
      title: wallet.name,
      type: wallet.type,
      isTitleHighlight: wallet.id === currentWallet.id,
      tail: `(${Object.keys(wallet.accounts).length})`,
      navItems: Object.keys(wallet.accounts).map(address => {
        const account = wallet.accounts[address];
        const icon = account.address === stakingStashAccountAddress ? { icon: 'lock' } : {};
        return {
          label: account.name || 'Account',
          link: `${ROUTES.WALLET.ROOT}/${wallet.id}/accounts/${account.address}`,
          ...icon,
        };
      }),
      additionalItem: addAccountButton(wallet),
    };
  });

  return (
    <SubNav {...{ footer }}>
      <CollapsibleMenu {...{ menuList }} />
      <AddAccountModal
        {...{ setAddAccountModalOpen, isAddAccountModalOpen, toUpdateWallet }}
        {...otherProps}
      />
    </SubNav>
  );
};

export default WalletDetailsSubNav;
