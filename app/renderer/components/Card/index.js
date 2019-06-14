import React from 'react';
import { Hint } from 'components';
import styled from 'styled-components';
import { colors } from 'theme';

const CardWrapper = styled.div`
  min-height: 3rem;
  border-radius: 3px;
  background: ${colors.background};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 1rem;
  flex-direction: column;
`;

const CardTitle = styled.div`
  display: flex;
  line-height: 1.5rem;
`;

const Card = ({ hint, title, children }) => (
  <CardWrapper>
    <CardTitle>
      <div>{title}</div>
      {hint && <Hint tooltip={{ styles: { maxWidth: '25rem' } }}>{hint}</Hint>}
    </CardTitle>
    <div>{children}</div>
  </CardWrapper>
);

export default Card;
