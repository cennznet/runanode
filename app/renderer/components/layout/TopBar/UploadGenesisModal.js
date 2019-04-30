import React from 'react';
import { Button, PageHeading, FileUploader, Modal, ModalBody, ModalFooter } from 'components';
import styled from 'styled-components';
import { colors } from 'theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const UploadFileWrapper = styled.div`
  margin: 1rem 0;
  width: 100%;
`;

const UploaderWrapper = styled.div`
  margin: 1rem 0 0.5rem;
`;

const FileAcceptNotice = styled.div`
  font-size: 0.8rem;
  color: ${colors.N300};
`;

const UploadGenesisModal = ({
  isUploadGenesisModal,
  setIsOpenUploadGenesisModal,
  selectedNetwork,
  genesisFile,
  setUpGenesisFile,
  onSwitchNetwork,
}) => {
  const singleFile = genesisFile && genesisFile[genesisFile.length - 1];

  return (
    <Modal isOpen={isUploadGenesisModal}>
      <ModalBody>
        <PageHeading>Sync to local test network</PageHeading>
        <ModalWarningWrapper>
          <UploadFileWrapper>
            <div>Upload chain setting file</div>
            <UploaderWrapper>
              <FileUploader
                value={singleFile ? `${singleFile.name} - ${singleFile.size} bytes` : null}
                backgroundColor="transparent"
                borderColor={colors.N0}
                focusBorderColor={colors.N0}
                acceptTypes=".json"
                onDrop={file => {
                  setUpGenesisFile(file);
                }}
              />
            </UploaderWrapper>
            <FileAcceptNotice>Accepted format: JSON</FileAcceptNotice>
          </UploadFileWrapper>
        </ModalWarningWrapper>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat variant="nuetral" onClick={() => setIsOpenUploadGenesisModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              setIsOpenUploadGenesisModal(false);
              onSwitchNetwork({ selectedNetwork, genesisFile: singleFile });
            }}
          >
            Start syncing
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default UploadGenesisModal;
