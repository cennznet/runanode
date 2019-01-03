import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  justify-content: ${p => p.center && 'center'};
  align-items: ${p => p.center && 'center'};
  padding: ${p => p.padding};
`;

Box.defaultProps = {
  padding: '1rem',
};

export default Box;
