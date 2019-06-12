import React from 'react';
import styled from 'styled-components';

const Doc = styled.div`
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
  }

  h6 {
    margin-top: 1rem;
  }

  p {
    line-height: 1.25rem;
    margin-top: 1.25rem;
  }
`;

const TosContent = () => {
  return (
    <Doc>
      <div>
        <h1>Terms of Service Agreement</h1>
      </div>
    </Doc>
  );
};

export default TosContent;
