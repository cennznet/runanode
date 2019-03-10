import React, { useState } from 'react';
import { Button } from 'components';
import StakeWarningModal from './StakeWarningModal';
import StakeConfirmModal from './StakeConfirmModal';

const Stake = ({ onStakeConfirmed, cennzFreeBalance, cpayFreeBalance, gasFee, stakingAccount }) => {
  const [isStakeWarningModalOpen, setStakeWarningModalOpen] = useState(false);
  const [isStakeConfirmModalOpen, setStakeConfirmModalOpen] = useState(true);

  const isStakingEnabled = stakingAccount && cennzFreeBalance && cpayFreeBalance > gasFee;

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
            cennzFreeBalance,
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
