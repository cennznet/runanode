import React, { useState } from 'react';
import { Button } from 'components';
import StakeWarningModal from './StakeWarningModal';
import StakeConfirmModal from './StakeConfirmModal';

const Stake = ({
  onStakeConfirmed,
  stakingBalance,
  cpayStakingBalance,
  gasFee,
  sufficientGasFee,
  stakingAccount,
}) => {
  const [isStakeWarningModalOpen, setStakeWarningModalOpen] = useState(false);
  const [isStakeConfirmModalOpen, setStakeConfirmModalOpen] = useState(false);

  const isStakingEnabled = stakingAccount && stakingBalance && sufficientGasFee;

  return (
    <div>
      <Button
        type="submit"
        onClick={() => setStakeWarningModalOpen(true)}
        disabled={!isStakingEnabled}
      >
        Stake
      </Button>
      {isStakeWarningModalOpen && (
        <StakeWarningModal
          {...{ isStakeWarningModalOpen, setStakeWarningModalOpen, setStakeConfirmModalOpen }}
        />
      )}
      {isStakeConfirmModalOpen && (
        <StakeConfirmModal
          {...{
            isStakeConfirmModalOpen,
            setStakeConfirmModalOpen,
            onStakeConfirmed,
            stakingBalance,
            gasFee,
            stakingAccount,
            isStakingEnabled,
          }}
        />
      )}
    </div>
  );
};

export default Stake;
