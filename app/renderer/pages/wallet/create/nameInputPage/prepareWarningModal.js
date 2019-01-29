import React from 'react';
import { Button, PageHeading, Modal } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STEPS } from '../constants';

const ModalWarningWrapper = styled.div`
  display: flex;
`;

const ModalWarningDetails = styled.div`
  margin-left: 0.5rem;
  line-height: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const PrepareWarningModal = ({
  isOpenPenPrepareModal,
  setIsOpenPenPrepareModal,
  setMnemonicString,
  moveToStep,
}) => (
  <Modal
    isOpen={isOpenPenPrepareModal}
    footer={
      <ButtonGroup>
        <Button flat color="nuetral" onClick={() => setIsOpenPenPrepareModal(false)}>
          Go back
        </Button>
        <Button
          style={{ marginLeft: '0.5rem' }}
          color="warning"
          onClick={() => {
            const mnemonic = window.odin.api.cennz.createMnemonic({ num: 12 });
            setMnemonicString(mnemonic);
            setIsOpenPenPrepareModal(false);
            moveToStep(STEPS.SEED_PHRASE);
          }}
        >
          I am prepared
        </Button>
      </ButtonGroup>
    }
  >
    <PageHeading>Please prepare a pen and paper</PageHeading>
    <ModalWarningWrapper>
      <div>
        <FontAwesomeIcon icon="exclamation-circle" size="sm" color={colors.warning} />
      </div>
      <ModalWarningDetails>
        <div>
          In the next step, CENNZ node will generate a random seed phrase. It is essential that you
          write this down and store it somewhere securely, like in a safe or safety deposit box. If
          you lose access to your wallet, this seed phrase is the only way to recover yours funds.
          Your seed phrase will only display once.
        </div>
        <div>For more information on how to keep your seed phrase safe click here</div>
      </ModalWarningDetails>
    </ModalWarningWrapper>
  </Modal>
);

export default PrepareWarningModal;
