import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: ${p => p.marginTop || '0'};
  margin-bottom: ${p => p.marginBottom || '2rem'};
`;

const SubHeading = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 14px;
  line-height: 1.2rem;
`;

const PageHeading = ({ subHeading, children }) => {
  return (
    <Wrapper>
      {children}
      {subHeading && <SubHeading>{subHeading}</SubHeading>}
    </Wrapper>
  );
};
export default PageHeading;
