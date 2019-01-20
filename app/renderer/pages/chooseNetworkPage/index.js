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

export const getNetworkOptionPair = value => NETWORK_OPTIONS.find(option => option.value === value);

const ChooseNetWork = ({
  onSelectNetwork,
  onUploadGenesisFile,
  onJoinNetwork,
  selectedNetwork,
  genesisConfigFile,
}) => {
  const selectedLocalNetwork = selectedNetwork === NetworkNameOptions.LOCAL_TESTNET;
  const canJoinLocalNetwork = selectedLocalNetwork && genesisConfigFile;
  const canJoinNetwork = canJoinLocalNetwork || (selectedNetwork && !selectedLocalNetwork);

  const storeGenesisFile = file => {
    if (file[0]) {
      console.log('files', file[0]);
      onUploadGenesisFile(file[0]);
    }
  };

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
                value={getNetworkOptionPair(selectedNetwork)}
                onChange={selected => {
                  console.log('selected value', selected);
                  onSelectNetwork(selected.value);
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
                    value={
                      genesisConfigFile
                        ? `${genesisConfigFile.name} - ${genesisConfigFile.size} bytes`
                        : null
                    }
                    backgroundColor="transparent"
                    borderColor={colors.N0}
                    focusBorderColor={colors.N0}
                    acceptTypes=".json"
                    onDrop={file => {
                      storeGenesisFile(file);
                    }}
                  />
                </UploaderWrapper>
                <FileAcceptNotice>Accepted format: JSON</FileAcceptNotice>
              </UploadFileWrapper>
            )}

            <ButtonWrapper>
              <div>
                <Button disabled={!canJoinNetwork} onClick={() => onJoinNetwork()}>
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
