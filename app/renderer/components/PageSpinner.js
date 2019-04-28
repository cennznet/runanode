import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'components';
import { colors } from 'renderer/theme';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Message = styled.div`
  margin-top: 0.5rem;
  text-align: center;
`;

const PageSpinner = ({ message }) => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <Spinner size="xl" />
        {message && <Message>{message}</Message>}
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

export default PageSpinner;
