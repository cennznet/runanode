import React, { useState } from 'react';
import { Button } from 'components';
import StakeWarningModal from './StakeWarningModal';
import StakeConfirmModal from './StakeConfirmModal';

const Stake = ({ onStakeConfirmed }) => {
  const [isStakeWarningModalOpen, setStakeWarningModalOpen] = useState(false);
  const [isStakeConfirmModalOpen, setStakeConfirmModalOpen] = useState(false);

  return (
    <div>
      <Button type="submit" color="primary" onClick={() => setStakeWarningModalOpen(true)}>
        Stake
      </Button>
      {isStakeWarningModalOpen && (
        <StakeWarningModal
          {...{ isStakeWarningModalOpen, setStakeWarningModalOpen, setStakeConfirmModalOpen }}
        />
      )}
      {isStakeConfirmModalOpen && (
        <StakeConfirmModal
          {...{ isStakeConfirmModalOpen, setStakeConfirmModalOpen, onStakeConfirmed }}
        />
      )}
    </div>
  );
};

export default Stake;
