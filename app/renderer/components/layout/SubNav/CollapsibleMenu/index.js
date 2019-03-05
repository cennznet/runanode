import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Accordion } from 'react-sanfona';
import { NavLink } from 'react-router-dom';
import Ellipsis from 'components/Ellipsis';
import { colors } from 'renderer/theme';
import AccordionItem from './AccordionItem';
import AccordionItemTitle from './AccordionItemTitle';
import AccordionItemBody from './AccordionItemBody';

const NavItem = styled(NavLink)`
  display: block;
  height: 3rem;
  line-height: 3rem;
  padding-left: 1rem;
  color: ${colors.textMuted};
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;

  &.active {
    background: linear-gradient(146.75deg, #1335b6 0%, #040c40 100%);
    color: ${colors.N0};
  }

  &:hover:not(.active) {
    background-color: ${colors.V500};
  }
`;

const CollapsibleMenu = ({ menuList, isInsideRouter }) => {
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
                      <NavItem as={!isInsideRouter && 'div'} key={uuid()} to={navItem.link}>
                        <Ellipsis title={navItem.label}>{navItem.label}</Ellipsis>
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
};

export default CollapsibleMenu;
