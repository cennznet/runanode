import React from 'react';
import styled from 'styled-components';
import themeObject, { colors } from 'theme';

const defaultThemeStyle = p => {
  return {
    background: colors.V800,
    color: colors.text,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const StakingProgressWrapper = styled.div`
  height: 5.5rem;
  border-radius: 3px;
  background: ${p => computedThemeStyle(p).background};
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

const StakingProgressCard = ({
  eraProgress,
  eraLength,
  sessionLength,
  sessionProgress,
  theme,
  themeKey,
}) => (
  <StakingProgressWrapper {...{ theme, themeKey }}>
    <ProgressInfoWrapper>
      <ProgressInfoTitle>Session</ProgressInfoTitle>
      <ProgressInfoDetails>
        <Progress>{sessionProgress}</Progress> / <Length>{sessionLength} blocks</Length>
      </ProgressInfoDetails>
    </ProgressInfoWrapper>
    <ProgressInfoWrapper>
      <ProgressInfoTitle>Era</ProgressInfoTitle>
      <ProgressInfoDetails>
        <Progress>{eraProgress}</Progress> / <Length>{eraLength} blocks</Length>
      </ProgressInfoDetails>
    </ProgressInfoWrapper>
  </StakingProgressWrapper>
);

StakingProgressCard.defaultProps = {
  theme: themeObject,
  themeKey: 'AppStakingProgressCard',
};

export default StakingProgressCard;
