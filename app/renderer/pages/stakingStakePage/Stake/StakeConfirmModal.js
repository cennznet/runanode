import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, PageHeading, Modal, ModalBody, ModalFooter } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const StakeConfirmModal = ({
  isStakeConfirmModalOpen,
  setStakeConfirmModalOpen,
  onStakeConfirmed,
}) => {
  return (
    <Modal isOpen={isStakeConfirmModalOpen}>
      <ModalBody>
        <PageHeading subHeading="">Confirm staking summary</PageHeading>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => setStakeConfirmModalOpen(false)}
          style={{ marginRight: '0.5rem' }}
          color="nuetral"
          flat
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onStakeConfirmed();
            setStakeConfirmModalOpen(false);
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StakeConfirmModal;
