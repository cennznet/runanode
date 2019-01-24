import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubNav } from 'components/layout';
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

const WalletDetailsSubNav = ({ wallets }) => {
  const navItems =
    wallets &&
    wallets.map(x => ({
      title: x.name,
      link: `${ROUTES.WALLET.DETAILS}/${x.id}`,
    }));

  return (
    <SubNav
      {...{ navItems }}
      footer={
        <SubNavFooter>
          <Button onClick={() => history.push(ROUTES.WALLET.LANDING)} outline block>
            <ButtonText>Add wallet</ButtonText>
            <FontAwesomeIcon icon="plus" />
          </Button>
        </SubNavFooter>
      }
    />
  );
};

export default WalletDetailsSubNav;
