import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, PageHeading, Modal, ModalBody, ModalFooter } from 'components';
import history from 'renderer/history';
import ROUTES from 'renderer/constants/routes';

const ExitAppWhileStakingModal = ({ isOpen, onToggleGlobalModal, modalType }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onToggleGlobalModal({ isOpen: false, type: modalType });
      }}
    >
      <ModalBody>
        <PageHeading>WARNING</PageHeading>
        <p>
          <FontAwesomeIcon icon="exclamation-triangle" size="sm" color={colors.warning} />
          <span>
            You are currently staking. Closing application while staking may face punishment. We
            suggest you unstake before closing Node.
          </span>
        </p>
      </ModalBody>
      <ModalFooter>
        <div style={{ display: 'flex' }}>
          <Button
            color="nuetral"
            onClick={() => {
              onToggleGlobalModal({ isOpen: false, type: modalType });
            }}
          >
            Close
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              onToggleGlobalModal({ isOpen: false, type: modalType });
              history.push(ROUTES.STAKING.MANAGE);
            }}
            danger
          >
            Unstake
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ExitAppWhileStakingModal;
