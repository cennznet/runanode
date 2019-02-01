import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Button, FileUploader, Select, PageHeading } from 'components';
import { Logger } from 'renderer/utils/logging';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';
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

export const NETWORK_OPTIONS = [
  { label: 'CENNZNet DEV', value: NetworkNameOptions.CENNZNET_DEV },
  { label: 'CENNZNet UAT', value: NetworkNameOptions.CENNZNET_UAT },
  { label: 'Local test net', value: NetworkNameOptions.LOCAL_TESTNET },
];

export const getNetworkOptionPair = (value, param) => {
  console.log('value', value);
  console.log('param', param);
  console.log('getNetworkOptionPair', NETWORK_OPTIONS.find(option => option[param] === value));
  return NETWORK_OPTIONS.find(option => option[param] === value);
};

const ChooseNetWork = ({
  selectedNetwork,
  setSelectedNetwork,
  genesisFile,
  setUpGenesisFile,
  onJoinNetwork,
}) => {
  const selectedLocalNetwork =
    selectedNetwork && selectedNetwork.value === NetworkNameOptions.LOCAL_TESTNET;
  const canJoinLocalNetwork = selectedLocalNetwork && genesisFile;
  const canJoinNetwork = canJoinLocalNetwork || (selectedNetwork && !selectedLocalNetwork);

  const singleFile = genesisFile && genesisFile[genesisFile.length - 1];
  Logger.info(`**Uploaded File: ${singleFile && singleFile.path}`);

  return (
    // <Layout sidebar={<SimpleSidebar />}>
    <Layout defaultSidebar>
      <LayoutWrapper>
        <MainContent>
          <ChooseNetworkWrapper>
            <JoinNetworkTitle>Join network</JoinNetworkTitle>
            <div>Choose network</div>
            <NetworkOptionWrapper>
              <Select
                value={selectedNetwork}
                onChange={selected => {
                  Logger.info('selected value', selected);
                  setSelectedNetwork(selected);
                }}
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
                      setUpGenesisFile(file);
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
                  onClick={() =>
                    onJoinNetwork({
                      selectedNetwork: selectedNetwork.value,
                      genesisFile: singleFile,
                    })
                  }
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
