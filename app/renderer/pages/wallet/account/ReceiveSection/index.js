import React from 'react';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from 'theme';
import config from 'app/config';
import DepositSteps from './DepositSteps';

const Wrapper = styled.div`
  line-height: 1.25rem;
`;

const Title = styled.div`
  margin-bottom: 2rem;
`;

const Warning = styled.div`
  margin-top: 2rem;
`;

const SectionRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const ReceiveSection = ({ account }) => {
  return (
    <Wrapper>
      <Title>Make deposit</Title>
      <DepositSteps accountAddress={account.address} />
      <Warning>
        <FontAwesomeIcon icon="exclamation-triangle" size="sm" color={colors.danger} />
        <span>
          {`WARNING: Only send assets that are compatible with ${
            config.net.name
          }. Sending other assets will
          result in permanent loss.`}
        </span>
      </Warning>
    </Wrapper>
  );
};

export default ReceiveSection;
