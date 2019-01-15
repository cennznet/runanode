import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import Select from 'components/Select';
import Button from 'components/Button';
import FileUploader from 'components/FileUploader';
import { Logger } from 'renderer/utils/logging';
import withContainer from './container';

const ChooseNetworkWrapper = styled.div`
  width: 60%;
`;

const JoinNetworkTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const NetworkOptionWrapper = styled.div`
  margin: 1rem 0;
`;

const UploadFileWrapper = styled.div`
  margin: 1.5rem 0 1rem;
`;

const UploaderWrapper = styled.div`
  margin: 1rem 0 0.5rem;
`;

const FileAcceptNotice = styled.div`
  font-size: 0.8rem;
  color: ${colors.N300};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const NETWORK_OPTIONS = [
  { label: 'Global test net', value: 'globalTestNet' },
  { label: 'Local test net', value: 'localTestNet' },
  { label: 'Main net', value: 'mainNet' },
];

const ChooseNetWork = ({
  onJoinNetwork,
  selectedNetwork,
  setSelectedNetwork,
  uploadedFile,
  setUploadedFile,
}) => {
  const selectedLocalNetwork = selectedNetwork && selectedNetwork.value === 'localTestNet';
  const canJoinLocalNetwork = selectedLocalNetwork && uploadedFile;
  const canJoinNetwork = canJoinLocalNetwork || (selectedNetwork && !selectedLocalNetwork);

  const onUploadFile = file => setUploadedFile(file);
  console.log('**uploadedFile**', uploadedFile);
  const singleFile = uploadedFile && uploadedFile[uploadedFile.length - 1];
  Logger.info(`**Uploaded File: ${singleFile && singleFile.path}`);

  const getLastUploadedFile = files => uploadedFile && uploadedFile[uploadedFile.length - 1];

  return (
    <Layout sidebar={<SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <ChooseNetworkWrapper>
            <JoinNetworkTitle>Join network</JoinNetworkTitle>
            <div>Choose network</div>
            <NetworkOptionWrapper>
              <Select
                value={selectedNetwork}
                onChange={selected => {
                  console.log('selectNetwork: ', selected.value);
                  setSelectedNetwork(selected);
                }}
                backgroundColor={colors.N800}
                selectedBackgroundColor={colors.N800}
                color={colors.N0}
                options={NETWORK_OPTIONS}
              />
            </NetworkOptionWrapper>
            {selectedLocalNetwork && (
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
                      setUploadedFile(file);
                    }}
                  />
                </UploaderWrapper>
                <FileAcceptNotice>Accepted format: JSON</FileAcceptNotice>
              </UploadFileWrapper>
            )}

            <ButtonWrapper>
              <div>
                <Button
                  disabled={!canJoinNetwork}
                  onClick={() => onJoinNetwork(selectedNetwork.value)}
                >
                  Join network
                </Button>
              </div>
            </ButtonWrapper>
          </ChooseNetworkWrapper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(ChooseNetWork);
