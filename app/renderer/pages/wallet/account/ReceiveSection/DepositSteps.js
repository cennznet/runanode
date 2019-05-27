import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { colors } from 'theme';

const StepWrapper = styled.div`
  display: flex;

  & + & {
    margin-top: 2rem;
  }
`;

const StepOrder = styled.div`
  margin-right: 1rem;
`;

const StepHeader = styled.div`
  font-weight: bold;
`;

const StepContent = styled.div`
  a {
    margin-left: 0.5rem;
  }
`;

const steps = (accountAddress = '') => [
  {
    order: 1,
    header: 'Copy your public address below',
    Content: () => <StepContent>{accountAddress}</StepContent>,
  },
  {
    order: 2,
    header: 'Send assets',
    Content: () => (
      <StepContent>
        To send yourself some CENNZ-T(CENNZ test token), and CENTRAPAY-T (CENTRAPAY teste token),
        paste your public address into the
        <a href="https://cennznet.js.org/faucet-ui/" target="_blank" rel="noopener noreferrer">
          faucet
        </a>
        . If you get stuck view this
        <a href="" target="_blank">
          tutorial
        </a>
        .
      </StepContent>
    ),
  },
  {
    order: 3,
    header: 'Check your balance',
    Content: () => (
      <StepContent>
        It may take a few minutes for your test tokens to be sent to your account. You can see the
        status of your tokens on the portfolio page.
      </StepContent>
    ),
  },
];

const StepOrderCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2rem;
  height: 2rem;
  border: 1px solid ${colors.primary};
  border-radius: 50%;
`;

const Step = ({ step }) => {
  return (
    <StepWrapper>
      <StepOrder>
        <StepOrderCircle>{step.order}</StepOrderCircle>
      </StepOrder>
      <div>
        <StepHeader>{step.header}</StepHeader>
        <step.Content />
      </div>
    </StepWrapper>
  );
};

const DepositSteps = ({ accountAddress }) => {
  return (
    <div>
      {steps(accountAddress) &&
        steps(accountAddress).map(step => <Step key={uuid()} {...{ step }} />)}
    </div>
  );
};

export default DepositSteps;
