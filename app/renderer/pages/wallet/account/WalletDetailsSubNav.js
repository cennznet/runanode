import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubNav, CollapsibleMenu } from 'components/layout';
import { Button } from 'components';
import ROUTES from 'renderer/constants/routes';
import history from 'renderer/history';

const SubNavFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
`;

const ButtonText = styled.div`
  margin-right: 0.5rem;
`;

const footer = (
  <SubNavFooter>
    <Button color="secondary" onClick={() => history.push(ROUTES.WALLET.LANDING)} block>
      <ButtonText>Add wallet</ButtonText>
      <FontAwesomeIcon icon="plus" />
    </Button>
  </SubNavFooter>
);

const WalletDetailsSubNav = ({ wallets }) => {
  const menuList = wallets.map(wallet => {
    return {
      title: wallet.name,
      navItems: Object.keys(wallet.accounts).map(address => {
        const account = wallet.accounts[address];
        return {
          label: account.name || account.address,
          link: `${ROUTES.WALLET.ROOT}/${wallet.id}/accounts/${account.address}`,
        };
      }),
    };
  });

  return (
    <SubNav {...{ footer }}>
      <CollapsibleMenu {...{ menuList }} />
    </SubNav>
  );
};

export default WalletDetailsSubNav;
