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

const SpinnerWrapper = styled.div``;

const Message = styled.div`
  margin-top: 0.5rem;
  text-align: center;
`;

const PageSpinner = ({ message }) => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <Spinner size="2.5rem" />
        {message && <Message>{message}</Message>}
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

export default PageSpinner;
