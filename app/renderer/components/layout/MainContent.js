import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const MainContent = styled.div`
  flex: 1 auto;
  background-color: ${colors.N800};
  padding: 3rem;
  min-width: 40rem;
  max-width: 50rem;
`;

export default MainContent;
