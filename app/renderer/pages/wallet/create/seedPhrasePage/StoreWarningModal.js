import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STEPS } from '../constants';

const ButtonGroup = styled.div`
  display: flex;
`;

const StoreWarningModal = ({ isStoreWarningModalOpen, setStoreWarningModalOpen, moveToStep }) => {
  return (
    <Modal isOpen={isStoreWarningModalOpen}>
      <ModalBody>
        <PageHeading subHeading="Please make sure you have written down the correct seed phrase. If you lose access to your wallet, this seed phrase is the only way to recover your funds.">
          Are you sure you have written down the correct seed phrase?
        </PageHeading>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat color="nuetral" onClick={() => setStoreWarningModalOpen(false)}>
            Go back
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              setStoreWarningModalOpen(false);
              moveToStep(STEPS.SEED_PHRASE_CONFIRM);
            }}
          >
            Yes
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default StoreWarningModal;
