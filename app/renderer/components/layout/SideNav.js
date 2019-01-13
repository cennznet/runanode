import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from 'renderer/theme';

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
  color: ${colors.N0};
  text-decoration: none;

  &.active {
    background-color: ${colors.primary};
  }

  &:hover:not(.active) {
    background-color: ${colors.N900};
  }
`;

const IconNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 5rem;
  background-color: ${colors.N1000};
`;

const TopIcons = styled.div``;
const BottomIcons = styled.div``;

const SideNav = () => (
  <Wrapper>
    <IconNav>
      <TopIcons>
        <IconLink to="/wallet/create">
          <FontAwesomeIcon icon="plus" />
        </IconLink>
        <IconLink to="/wallet/import">
          <FontAwesomeIcon icon="wallet" />
        </IconLink>
      </TopIcons>
      <BottomIcons>
        <IconLink to="/dev">
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
