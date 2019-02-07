import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors } from 'renderer/theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  border-top: ${p => (p.blank ? 0 : `1px solid ${rgba(255, 255, 255, 0.3)}`)};
`;

const PageFooter = ({ blank, children }) => {
  return <Wrapper {...{ blank }}>{children}</Wrapper>;
};

export default PageFooter;
