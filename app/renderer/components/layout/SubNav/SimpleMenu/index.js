import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { NavLink } from 'react-router-dom';
import themeObject, { colors } from 'theme';

const defaultThemeStyle = p => {
  return {
    navItemColor: colors.textMuted,
    navItemHoverBackground: colors.V500,
    navItemHoverColor: colors.N500,
    navItemActiveColor: colors.N0,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const CustomNavLink = ({ theme, themeKey, children, ...props }) => {
  return <NavLink {...props}>{children}</NavLink>;
};

const NavItem = styled(CustomNavLink)`
  display: block;
  height: 5rem;
  line-height: 5rem;
  padding-left: 1rem;
  font-size: 1rem;
  color: ${p => computedThemeStyle(p).navItemColor};
  text-decoration: none;
  cursor: pointer;

  &.active {
    color: ${p => computedThemeStyle(p).navItemActiveColor};
  }

  &:hover:not(.active) {
    background: ${p => computedThemeStyle(p).navItemHoverBackground};
  }
`;

const SimpleMenu = ({ theme, themeKey, navItems, isInsideRouter }) => {
  return (
    <div>
      {navItems &&
        navItems.map(item => (
          <NavItem
            key={uuid()}
            as={!isInsideRouter && 'div'}
            {...{ theme, themeKey }}
            to={item.link}
          >
            {item.label}
          </NavItem>
        ))}
    </div>
  );
};

SimpleMenu.defaultProps = {
  isInsideRouter: true,
  theme: themeObject,
  themeKey: 'AppSubNavSimpleMenu',
};

export default SimpleMenu;
