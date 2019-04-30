import React, { useEffect } from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading } from 'components';
import styled from 'styled-components';
import { colors } from 'theme';

const StakingProgressWrapper = styled.div`
  height: 5.5rem;
  border-radius: 3px;
  background: #020835;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
`;

const ProgressInfoWrapper = styled.div`
  width: 100%;
  padding: 2rem;
`;

const ProgressInfoTitle = styled.div`
  color: ${colors.textMuted};
  margin-bottom: 0.5rem;
`;

const ProgressInfoDetails = styled.div`
  display: flex;
  color: ${colors.text};
  align-items: center;
`;

const Progress = styled.div`
  font-size: 22px;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const Length = styled.div`
  margin-left: 0.5rem;
  font-size: 16px;
`;

const StakingProgressCard = ({ eraProgress, eraLength, sessionLength, sessionProgress }) => (
  <StakingProgressWrapper>
    <ProgressInfoWrapper>
      <ProgressInfoTitle>1 Session</ProgressInfoTitle>
      <ProgressInfoDetails>
        <Progress>{sessionProgress}</Progress> / <Length>{sessionLength} blocks</Length>
      </ProgressInfoDetails>
    </ProgressInfoWrapper>
    <ProgressInfoWrapper>
      <ProgressInfoTitle>1 Era</ProgressInfoTitle>
      <ProgressInfoDetails>
        <Progress>{eraProgress}</Progress> / <Length>{eraLength} blocks</Length>
      </ProgressInfoDetails>
    </ProgressInfoWrapper>
  </StakingProgressWrapper>
);

export default StakingProgressCard;
