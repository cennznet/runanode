import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STEPS } from './constants';

const InputTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

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

const NameInputPage = ({
  step,
  moveToStep,
  setMnemonicString,
  walletName,
  setWalletName,
  isOpenPenPrepareModal,
  setIsOpenPenPrepareModal,
}) => {
  return (
    <React.Fragment>
      <div>
        <PageHeading subHeading="">Name your wallet</PageHeading>
        <InputTitle>Wallet name</InputTitle>
        <Input
          backgroundColor={colors.V400}
          borderColor="transparent"
          color={colors.N0}
          height="3rem"
          onChange={e => setWalletName(e.target.value)}
        />
      </div>
      <PageFooter>
        <StartOverLink />
        <Button disabled={!walletName} onClick={() => setIsOpenPenPrepareModal(true)}>
          Next
        </Button>
      </PageFooter>

      <Modal
        isOpen={isOpenPenPrepareModal}
        footer={
          <ButtonGroup>
            <Button flat color="nuetral" onClick={() => setIsOpenPenPrepareModal(false)}>
              Go back
            </Button>
            <Button
              warning
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
              In the next step, CENNZ node will generate a random seed phrase. It is essential that
              you write this down and store it somewhere securely, like in a safe or safety deposit
              box. If you lose access to your wallet, this seed phrase is the only way to recover
              yours funds. Your seed phrase will only display once.
            </div>
            <div>For more information on how to keep your seed phrase safe click here</div>
          </ModalWarningDetails>
        </ModalWarningWrapper>
      </Modal>
    </React.Fragment>
  );
};

export default NameInputPage;
