import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from 'renderer/theme';
import ROUTES from 'renderer/constants/routes';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 5rem;
`;

const IconLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  font-size: 1rem;
  color: ${colors.textMuted};
  text-decoration: none;

  &.active {
    color: ${colors.N0};
  }

  &:hover:not(.active) {
    background-color: ${colors.V500};
  }
`;

const IconNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 5rem;
  background-color: ${colors.V900};
`;

const TopIcons = styled.div``;
const BottomIcons = styled.div``;

const SideNav = () => (
  <Wrapper>
    <IconNav>
      <TopIcons>
        <IconLink to={ROUTES.WALLET.ROOT}>
          <FontAwesomeIcon icon="wallet" />
        </IconLink>
      </TopIcons>
      <BottomIcons>
        <IconLink to="/dev">
          <FontAwesomeIcon icon={['fab', 'dev']} />
        </IconLink>
        <IconLink to={ROUTES.SETTINGS.ROOT}>
          <FontAwesomeIcon icon="cogs" />
        </IconLink>
        <IconLink to="/syncNode">
          <FontAwesomeIcon icon="question-circle" />
        </IconLink>
      </BottomIcons>
    </IconNav>
  </Wrapper>
);

export default SideNav;
