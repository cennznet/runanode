import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { colors } from 'theme';
import { Scrollable } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 15rem;
  max-width: 15rem;
  height: 100%;
  font-weight: 500;
  background: ${colors.N50};
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #d0d3d5, 4px 0 8px 0 #d0d3d5;
  color: ${colors.N700};
`;

const Footer = styled.div`
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #7F878D) 0%, #7F878D 100%);
`;

const SubNav = ({ navItems, children, footer, ...props }) => (
  <Wrapper {...props}>
    <Scrollable themeStyle={{ height: `${footer ? 'calc(100% - 6rem)' : '100%'}` }}>
      {children}
    </Scrollable>
    {footer && <Footer>{footer}</Footer>}
  </Wrapper>
);

export default SubNav;
