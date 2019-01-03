import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.N1000};
`;

const Topbar = () => (
  <Wrapper>
    <div>Network info comes here...</div>
    <div>Block info comes here...</div>
  </Wrapper>
);

export default Topbar;
