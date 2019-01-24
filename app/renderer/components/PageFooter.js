import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors } from 'renderer/theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  border-top: 1px solid ${rgba(255, 255, 255, 0.3)};
`;

const PageFooter = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default PageFooter;
