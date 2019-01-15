import React from 'react';
import styled from 'styled-components';

const PageHeading = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: ${p => p.marginTop || '0'};
  margin-bottom: ${p => p.marginBottom || '2rem'};
`;

export default PageHeading;
