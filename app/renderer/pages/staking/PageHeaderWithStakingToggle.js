import React from 'react';
import styled from 'styled-components';
import theme from 'theme';
import { PageHeading, Button } from 'components';

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

const StakeToggleButton = ({ isStakingStated, onClickStakeButton, buttonText, ...restProps }) => {
  return <Button {...restProps}>{buttonText}</Button>;
};

const PageHeaderWithStakingToggle = ({
  intentionsWithBalances,
  isStakingStated,
  onClickStakeButton,
  stakingStashAccountAddress,
  subHeading,
}) => {
  const toShowNextUpHintText =
    intentionsWithBalances.filter(waitingUser => waitingUser.address === stakingStashAccountAddress)
      .length > 0;

  return (
    <PageHeading subHeading={subHeading}>
      <PageTitleWrapper>
        <TextTitleWrapper>
          <div>Staking overview</div>
          {toShowNextUpHintText && (
            <NextUpHintText>You may join validator list at next era</NextUpHintText>
          )}
        </TextTitleWrapper>
        <StakeToggleButton
          size="lg"
          buttonText={isStakingStated ? 'Unstake' : 'Stake'}
          {...{ isStakingStated, onClickStakeButton }}
        />
      </PageTitleWrapper>
    </PageHeading>
  );
};

export default PageHeaderWithStakingToggle;
