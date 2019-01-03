import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import { colors } from 'renderer/theme';

const Wrapper = styled.div`
  width: 17rem;
  height: 100%;
  background-color: ${colors.N900};
  overflow: hidden;
`;

const NavItem = styled(NavLink)`
  display: block;
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  padding-left: 1rem;
  font-size: 1rem;
  color: ${colors.N0};
  text-decoration: none;

  &.active {
    background-color: ${colors.primary};
  }

  &:hover:not(.active) {
    background-color: ${colors.N1000};
  }
`;

const SubNav = ({ navItems }) => (
  <Wrapper>
    {navItems.map(item => (
      <NavItem key={uuid()} to={item.link}>
        {item.title}
      </NavItem>
    ))}
  </Wrapper>
);

export default SubNav;
