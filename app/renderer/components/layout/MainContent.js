import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const MainContent = styled.div`
  position: relative;
  display: ${p => (p.display === 'flex' ? 'flex' : 'block')};
  flex-direction: ${p => (p.display === 'flex' ? 'column' : 'none')};
  justify-content: ${p => (p.display === 'flex' ? 'space-between' : 'none')};
  margin: 0 auto;
  background: transparent;
  padding: 3rem 0 0 3rem;
  min-width: 45rem;
  max-width: 45rem;

  .content {
    flex: 1 auto;
  }
`;

MainContent.defaultProps = {
  display: 'block',
};

export default MainContent;
