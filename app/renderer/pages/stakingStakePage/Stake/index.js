import React, { useState } from 'react';
import { Button } from 'components';
import StakeWarningModal from './StakeWarningModal';
import StakeConfirmModal from './StakeConfirmModal';

const Stake = ({
  onStakeConfirmed,
  cennzStakingBalance,
  cpayStakingBalance,
  gasFee,
  sufficientGasFee,
  stakingAccount,
}) => {
  const [isStakeWarningModalOpen, setStakeWarningModalOpen] = useState(false);
  const [isStakeConfirmModalOpen, setStakeConfirmModalOpen] = useState(false);

  const isStakingEnabled = stakingAccount && cennzStakingBalance && sufficientGasFee;

  return (
    <div>
      <Button
        type="submit"
        color="primary"
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
            cennzStakingBalance,
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
