import React from 'react';
import styled from 'styled-components';
import { colors } from 'theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  border-top: ${p => (p.blank ? 0 : `1px solid ${colors.borderLight || colors.border}`)};
`;

const PageFooter = ({ blank, children }) => {
  return <Wrapper {...{ blank }}>{children}</Wrapper>;
};

export default PageFooter;
