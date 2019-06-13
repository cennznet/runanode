import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Accordion } from 'react-sanfona';
import { NavLink } from 'react-router-dom';
import Ellipsis from 'components/Ellipsis';
import themeObject, { colors } from 'theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccordionItem from './AccordionItem';
import AccordionItemTitle from './AccordionItemTitle';
import AccordionItemBody from './AccordionItemBody';

const defaultThemeStyle = p => {
  return {
    navItemColor: colors.textMuted,
    navItemHoverBackground: colors.V500,
    navItemHoverColor: colors.N500,
    navItemActiveBackground: 'linear-gradient(146.75deg, #1335b6 0%, #040c40 100%)',
    navItemActiveColor: colors.N0,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const CustomNavLink = ({ theme, themeKey, children, ...props }) => {
  return <NavLink {...props}>{children}</NavLink>;
};

const NavItem = styled(CustomNavLink)`
  display: block;
  height: 3rem;
  line-height: 3rem;
  padding-left: 1rem;
  color: ${p => computedThemeStyle(p).navItemColor};
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;

  &.active {
    background: ${p => computedThemeStyle(p).navItemActiveBackground};
    color: ${p => computedThemeStyle(p).navItemActiveColor};
  }

  &:hover:not(.active) {
    background: ${p => computedThemeStyle(p).navItemHoverBackground};
    color: ${p => computedThemeStyle(p).navItemHoverColor};
  }
`;

const NavItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollapsibleMenu = ({ menuList, isInsideRouter, theme, themeKey }) => {
  return (
    <Accordion>
      {menuList &&
        menuList.map((menu, i) => {
          const { type, title, isTitleHighlight, tail, navItems, additionalItem } = menu;
          return (
            <AccordionItem
              key={uuid()}
              title={AccordionItemTitle({ title, isTitleHighlight, tail })}
              expanded={i === 0}
            >
              <AccordionItemBody>
                {navItems &&
                  navItems.map(navItem => {
                    return (
                      <NavItem
                        as={!isInsideRouter && 'div'}
                        key={uuid()}
                        to={navItem.link}
                        {...{ theme, themeKey }}
                      >
                        <NavItemContent>
                          <Ellipsis title={navItem.label} substrLength={10}>
                            {navItem.label}
                          </Ellipsis>
                          {navItem.icon && (
                            <div>
                              <FontAwesomeIcon icon={navItem.icon} />
                            </div>
                          )}
                        </NavItemContent>
                      </NavItem>
                    );
                  })}
                {additionalItem}
              </AccordionItemBody>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};

CollapsibleMenu.defaultProps = {
  isInsideRouter: true,
  theme: themeObject,
  themeKey: 'AppSubNavCollapsibleMenu',
};

export default CollapsibleMenu;
