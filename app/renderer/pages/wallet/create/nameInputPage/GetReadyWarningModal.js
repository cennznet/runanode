import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { colors } from 'theme';
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

const GetReadyWarningModal = ({
  isOpenPenPrepareModal,
  setIsOpenPenPrepareModal,
  setMnemonicString,
  moveToStep,
  setError,
  onCreateWallet,
  walletName,
  setWallet,
}) => {
  const onClickButton = async () => {
    const wallet = await onCreateWallet({
      name: walletName,
      passphrase: '',
    });

    setIsOpenPenPrepareModal(false);

    if (wallet && wallet.id) {
      const { mnemonic } = wallet;
      setError(null);
      setMnemonicString(mnemonic);

      wallet.mnemonic = undefined; // Use delete cause slow performance
      setWallet(wallet);
      moveToStep(STEPS.SEED_PHRASE);
    } else {
      // TODO: Failed toaster and err field display
      setError('Failed to create wallet, please try again');
    }
  };

  return (
    <Modal isOpen={isOpenPenPrepareModal}>
      <ModalBody>
        <PageHeading>Please prepare a pen and paper</PageHeading>
        <ModalWarningWrapper>
          <div>
            <FontAwesomeIcon icon="exclamation-circle" size="sm" color={colors.warning} />
          </div>
          <ModalWarningDetails>
            <div>
              In the next step, CENNZ node will generate a random seed phrase. It is essential that
              you write this down and store it somewhere securely, like in a safe or safety deposit
              box. If you lose access to your wallet, this seed phrase is the only way to recover
              yours funds. Your seed phrase will only display once.
            </div>
            <div>For more information on how to keep your seed phrase safe click here</div>
          </ModalWarningDetails>
        </ModalWarningWrapper>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat variant="nuetral" onClick={() => setIsOpenPenPrepareModal(false)}>
            Go back
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            variant="warning"
            onClick={() => onClickButton()}
          >
            I am prepared
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default GetReadyWarningModal;
