import React, { useState } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { colors } from 'theme';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import SimpleSidebar from 'components/layout/SimpleSidebar'; // have to import like this to fix this issue: https://stackoverflow.com/questions/50428339/error-minified-react-error-130
import { Button, FileUploader, Select, PageFooter } from 'components';
import { Logger } from 'renderer/utils/logging';
import { NetworkNameMapping } from 'common/types/theNode.types';
import appConfig from 'app/config';
import withContainer from './container';

const ChooseNetworkWrapper = styled.div`
  width: 60%;
`;

const JoinNetworkTitle = styled.div`
  color: ${colors.text};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const NetworkOptionWrapper = styled.div`
  margin: 1rem 0;
`;

const DevelopmentNetworkDesc = styled.div`
  color: ${colors.textMuted};
  line-height: 1rem;
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
  { label: 'RIMU(UAT)', value: NetworkNameMapping.THENODE_RIMU },
  { label: 'KAURI(DEV)', value: NetworkNameMapping.THENODE_KAURI },
  { label: 'Self hosted net', value: NetworkNameMapping.Development },
];

const getNetworkOptions = () => {
  let items = NETWORK_OPTIONS;
  const sorting = appConfig.app.networkOptions;
  const result = [];
  sorting.forEach(key => {
    let found = false;
    items = items.filter(item => {
      if (!found && item.value === key) {
        result.push(item);
        found = true;
        return false;
      }
      return true;
    });
  });
  Logger.debug(`getNetworkOptions, result: ${JSON.stringify(result)}`);
  return result;
};

const sortedNetworkOptions = getNetworkOptions();
export const NETWORK_OPTIONS_SORTED = sortedNetworkOptions;

export const getNetworkOptionPair = (value, param = 'value') => {
  return NETWORK_OPTIONS.find(option => option[param] === value);
};

const ChooseNetWork = ({ onJoinNetwork }) => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [genesisFile, setUpGenesisFile] = useState(null);

  const selectedLocalNetwork =
    selectedNetwork && selectedNetwork.value === NetworkNameMapping.Development;
  const canJoinLocalNetwork = selectedLocalNetwork && genesisFile;
  const canJoinNetwork = canJoinLocalNetwork || (selectedNetwork && !selectedLocalNetwork);

  const singleFile = genesisFile && genesisFile[genesisFile.length - 1];
  Logger.info(`**Uploaded File: ${singleFile && singleFile.path}`);

  return (
    <Layout sidebar={<SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <ChooseNetworkWrapper>
            <JoinNetworkTitle>Join network</JoinNetworkTitle>
            <div>Choose network</div>
            <NetworkOptionWrapper>
              <Select
                backgroundColor={colors.V800}
                value={selectedNetwork}
                onChange={selected => {
                  Logger.info('selected value', selected);
                  setSelectedNetwork(selected);
                }}
                options={NETWORK_OPTIONS_SORTED}
              />
            </NetworkOptionWrapper>
            {selectedLocalNetwork && (
              <div>
                <DevelopmentNetworkDesc>
                  We suggest that you keep main net set as your default network. The other networks
                  are designed for developers and should only be used if you are sure of what
                  you&apos;re doing.
                </DevelopmentNetworkDesc>
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
              </div>
            )}

            <ButtonWrapper>
              <div>
                <Button
                  disabled={!canJoinNetwork}
                  onClick={() =>
                    onJoinNetwork({
                      selectedNetwork,
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
