import React from 'react';
import R from 'ramda';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubNav, CollapsibleMenu } from 'components/layout';
import { Button } from 'components';
import ROUTES from 'renderer/constants/routes';
import history from 'renderer/history';
import { walletType } from 'renderer/constants/wallet';

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

const additionalItem = (
  <AddAccountButtonWrapper>
    <Button color="secondary" size="lg" block>
      <span>Add account</span>
      <IconPlus />
    </Button>
  </AddAccountButtonWrapper>
);

const WalletDetailsSubNav = ({ wallets, currentWallet }) => {
  const menuList = wallets.map(wallet => {
    return {
      title: wallet.name,
      type: wallet.type,
      isTitleHighlight: wallet.id === currentWallet.id,
      tail: `(${Object.keys(wallet.accounts).length})`,
      navItems: Object.keys(wallet.accounts).map(address => {
        const account = wallet.accounts[address];
        return {
          label: account.name || account.address,
          link: `${ROUTES.WALLET.ROOT}/${wallet.id}/accounts/${account.address}`,
        };
      }),
      additionalItem: wallet.type !== walletType.SIMPLEWALLET && additionalItem,
    };
  });

  return (
    <SubNav {...{ footer }}>
      <CollapsibleMenu {...{ menuList }} />
    </SubNav>
  );
};

export default WalletDetailsSubNav;
