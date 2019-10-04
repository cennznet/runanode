import React, { useState } from 'react';
import R from 'ramda';
import styled from 'styled-components';
import theme from 'theme';
import { PageHeading, Button } from 'components';

import withContainer from './container';
import UnStakeWarningModal from '../UnStakeWarningModal';

const PageTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NextUpHintText = styled.div`
  font-size: 10px;
  background: ${theme.listitemHighlightGradient};
  border-radius: 12px;
  height: 1.2rem;
  line-height: 1.2rem;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
`;

const StakeToggleButton = ({ isStakingStated, onClickStakeButton, setUnStakeWarningModalOpen }) => {
  return (
    <Button
      size="lg"
      variant={isStakingStated ? 'danger' : 'primary'}
      onClick={isStakingStated ? () => setUnStakeWarningModalOpen(true) : onClickStakeButton}
    >
      {isStakingStated ? 'Unstake' : 'Stake'}
    </Button>
  );
};

const PageHeaderWithStakingToggle = ({
  heading,
  intentionsWithBalances,
  isStakingStated,
  onClickStakeButton,
  onUnStake,
  stakingStashAccountAddress,
  subHeading,
  stakingAccount,
  stakingWallet,
}) => {
  const [isUnStakeWarningModalOpen, setUnStakeWarningModalOpen] = useState(false);

  const isShowingNextUpLabel = R.compose(
    R.not,
    R.isEmpty,
    R.filter(waitingUser => waitingUser.address === stakingStashAccountAddress)
  )(intentionsWithBalances);

  return (
    <PageHeading subHeading={subHeading}>
      <PageTitleWrapper>
        <TextTitleWrapper>
          <div>{heading}</div>
          {isShowingNextUpLabel && (
            <NextUpHintText>You may join validator list at next era</NextUpHintText>
          )}
        </TextTitleWrapper>
        <StakeToggleButton
          {...{ isStakingStated, onClickStakeButton, setUnStakeWarningModalOpen }}
        />
      </PageTitleWrapper>
      <UnStakeWarningModal
        {...{
          isUnStakeWarningModalOpen,
          setUnStakeWarningModalOpen,
          onUnStake,
          stakingWallet,
          stakingAccount,
        }}
      />
    </PageHeading>
  );
};

export default withContainer(PageHeaderWithStakingToggle);
