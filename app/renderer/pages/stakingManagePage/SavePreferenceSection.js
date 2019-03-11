import React from 'react';
import styled from 'styled-components';

import { PreDefinedAssetId, PreDefinedAssetIdName } from 'common/types/cennznet-node.types';
import { colors } from 'renderer/theme';
import { Button }from 'components';

const ChangePreferenceButton = styled(Button)`
`;

const StakingPreferenceWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: ${colors.V900};
  border-radius: 3px;
  padding: 2rem 2rem 4rem 1rem;
  margin-top: 2rem;
`;

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: 600;
  width: 100%
`;

const Left = styled.div`
`;

const Right = styled.div`
`;

const SavePreferenceSection = ({ validatorPreferences, setChangeStakingPreferenceModalOpen, intentionsIndex }) => {
  return (
    <StakingPreferenceWrapper>
      <Header>
        Staking preference
      </Header>
      <Item>
        <Left>Unstake threshold</Left>
        <Right>{validatorPreferences ? validatorPreferences.unstakeThreshold.toString() : ''} warnings</Right>
      </Item>
      <Item>
        <Left>Validator payment</Left>
        <Right>{validatorPreferences ? validatorPreferences.validatorPayment.toString() : ''} {PreDefinedAssetIdName[PreDefinedAssetId.stakingToken]}</Right>
      </Item>
      <Item>
        <Left />
        <Right>
          <ChangePreferenceButton
            onClick={() => setChangeStakingPreferenceModalOpen(true)}
            disabled={intentionsIndex < 0}>
            Change preference
          </ChangePreferenceButton>
        </Right>
      </Item>
    </StakingPreferenceWrapper>
  );
};

export default SavePreferenceSection;