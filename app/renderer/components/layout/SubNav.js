import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import { colors } from 'renderer/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 17rem;
  max-width: 17rem;
  height: 100%;
  font-weight: 500;
  background-color: ${colors.V900};
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

const SubNav = ({ navItems, footer }) => (
  <Wrapper>
    <div>
      {navItems.map(item => (
        <NavItem key={uuid()} to={item.link}>
          {item.title}
        </NavItem>
      ))}
    </div>
    {footer}
  </Wrapper>
);

export default SubNav;
