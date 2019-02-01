import React from 'react';
import { Button, PageHeading, Modal, Checkbox } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { compose, lifecycle, withState, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';

const ButtonGroup = styled.div`
  display: flex;
`;

const StoreWarningModal = ({
  isSeedPhaseDownloadModalOpen,
  setSeedPhaseDownloadModalOpen,
  isSeedPhaseDownloadModalConfirmCheck,
  setSeedPhaseDownloadModalConfirmCheck,
  onCreatePaperWallet,
  walletName,
  mnemonicString,
  networkName,
}) => {
  return (
    <Modal
      isOpen={isSeedPhaseDownloadModalOpen}
      footer={
        <React.Fragment>
          <ButtonGroup>
            <Button flat color="nuetral" onClick={() => setSeedPhaseDownloadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isSeedPhaseDownloadModalConfirmCheck}
              color="warning"
              style={{ marginLeft: '0.5rem' }}
              onClick={() => {
                onCreatePaperWallet({
                  mnemonic: mnemonicString,
                  address: 'Wallet address', // TODO
                  name: walletName,
                  networkName,
                  isMainnet: true,
                });
                setSeedPhaseDownloadModalOpen(false);
              }}
            >
              Download
            </Button>
          </ButtonGroup>

          <Checkbox
            checked={isSeedPhaseDownloadModalConfirmCheck}
            onChange={() => {
              setSeedPhaseDownloadModalConfirmCheck(!isSeedPhaseDownloadModalConfirmCheck);
            }}
          >
            I understand the risk
          </Checkbox>
        </React.Fragment>
      }
    >
      <PageHeading subHeading="This is the least safe way to save your seed phrase. There is risk of your computer getting hacked and your seed stolen.">
        Download seed phrase as a PDF
      </PageHeading>
    </Modal>
  );
};

const enhance = compose(
  withState('isSeedPhaseDownloadModalConfirmCheck', 'setSeedPhaseDownloadModalConfirmCheck', false)
);

export default enhance(StoreWarningModal);
