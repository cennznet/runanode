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
`;

const SubNav = ({ navItems, children, footer, ...props }) => (
  <Wrapper {...props}>
    <Scrollable styles={{ height: 'calc(100% - 1rem)' }}>{children}</Scrollable>
    {footer}
  </Wrapper>
);

export default SubNav;
