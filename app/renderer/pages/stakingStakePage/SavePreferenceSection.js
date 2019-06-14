import React from 'react';
import styled from 'styled-components';

import { PreDefinedAssetId, PreDefinedAssetIdName } from 'common/types/theNode.types';
import themeObject, { colors } from 'theme';
import { Button } from 'components';

const defaultThemeStyle = p => {
  return {
    background: colors.V900,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const StepDescription = styled.div`
  margin: 1.5rem 0;
`;

const ChangePreferenceButton = styled(Button)``;

const StakingPreferenceWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background: ${colors.background};
  border-radius: 3px;
  color: ${colors.text};
  padding: 2rem 2rem 4rem 1rem;
  margin-top: 2rem;
`;

StakingPreferenceWrapper.defaultProps = {
  theme: themeObject,
  themeKey: 'AppStakingPreferenceCard',
};

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: 600;
  width: 100%;
`;

const Left = styled.div``;

const Right = styled.div``;

const SavePreferenceSection = ({ validatorPreferences, setChangeStakingPreferenceModalOpen }) => {
  return (
    <div>
      <StepDescription>Step 4: Update staking preference.</StepDescription>
      <StakingPreferenceWrapper>
        <Header>Staking preference</Header>
        <Item>
          <Left>Unstake threshold</Left>
          <Right>
            {validatorPreferences && validatorPreferences.unstakeThreshold
              ? validatorPreferences.unstakeThreshold.toString()
              : ''}
            warnings
          </Right>
        </Item>
        <Item style={{ display: 'none' }}>
          <Left>Validator payment</Left>
          <Right>
            {validatorPreferences && validatorPreferences.validatorPayment
              ? validatorPreferences.validatorPayment.toString()
              : ''}
            {PreDefinedAssetIdName[PreDefinedAssetId.stakingToken]}
          </Right>
        </Item>
        <Item>
          <Left />
          <Right>
            <ChangePreferenceButton onClick={() => setChangeStakingPreferenceModalOpen(true)}>
              Change preference
            </ChangePreferenceButton>
          </Right>
        </Item>
      </StakingPreferenceWrapper>
    </div>
  );
};

export default SavePreferenceSection;
