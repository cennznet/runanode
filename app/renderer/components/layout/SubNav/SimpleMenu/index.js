import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import { colors } from 'renderer/theme';

const NavItem = styled(NavLink)`
  display: block;
  height: 5rem;
  line-height: 5rem;
  padding-left: 1rem;
  font-size: 1rem;
  color: ${colors.textMuted};
  text-decoration: none;
  cursor: pointer;

  &.active {
    color: ${colors.N0};
  }

  &:hover:not(.active) {
    background: ${colors.V500};
  }
`;

const SimpleMenu = ({ navItems, isInsideRouter }) => {
  return (
    <div>
      {navItems &&
        navItems.map(item => (
          <NavItem key={uuid()} as={!isInsideRouter && 'div'} to={item.link}>
            {item.label}
          </NavItem>
        ))}
    </div>
  );
};

SimpleMenu.defaultProps = {
  isInsideRouter: true,
};

export default SimpleMenu;
