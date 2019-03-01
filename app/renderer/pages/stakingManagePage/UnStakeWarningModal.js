import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonGroup = styled.div`
  display: flex;
`;

const UnStakeWarningModal = ({ isUnStakeWarningModalOpen, setUnStakeWarningModalOpen, onUnStake, stakingWallet, stakingAccount }) => {
  return (
    <Modal isOpen={isUnStakeWarningModalOpen} style={{maxHeight: '20vh'}}>
      <ModalBody>
        <PageHeading subHeading="Once you confirm unstake,your account will stop to stake. It will keep locked until 72 hours later for security reason.">
          Are you sure you want to unstake?
        </PageHeading>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat color="nuetral" onClick={() => setUnStakeWarningModalOpen(false)}>
            Cancel
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              setUnStakeWarningModalOpen(false);
              onUnStake({
                wallet: stakingWallet,
                stashAccountAddress: stakingAccount.address,
                passphrase: '',
              });
            }}
          >
            Yes
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default UnStakeWarningModal;
