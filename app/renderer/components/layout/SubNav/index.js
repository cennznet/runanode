import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { colors } from 'renderer/theme';
import { Scrollable } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 15rem;
  max-width: 15rem;
  height: 100%;
  font-weight: 500;
  background-color: ${colors.V900};
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 4px 0 8px 0 rgba(0, 0, 0, 0.14);
`;

const SubNav = ({ navItems, children, footer, ...props }) => (
  <Wrapper {...props}>
    <Scrollable styles={{ height: '100%' }}>{children}</Scrollable>
    {footer}
  </Wrapper>
);

export default SubNav;
