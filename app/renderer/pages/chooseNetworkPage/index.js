import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Button, FileUploader, Select, PageHeading } from 'components';

import withContainer from './container';

const ChooseNetworkWrapper = styled.div``;

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

const ChooseNetWork = ({ onJoinNetwork, selectedNetwork, setSelectedNetwork }) => (
  // <Layout sidebar={<SimpleSidebar />}>
  <Layout defaultSidebar>
    <LayoutWrapper>
      <MainContent>
        <ChooseNetworkWrapper>
          <PageHeading>Join network</PageHeading>
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
          {selectedNetwork && selectedNetwork.value === 'localTestNet' && (
            <UploadFileWrapper>
              <div>Upload chain setting file</div>
              <UploaderWrapper>
                <FileUploader
                  backgroundColor="transparent"
                  borderColor={colors.N0}
                  focusBorderColor={colors.N0}
                  acceptTypes="./json"
                  // TODO: store the path and insert into command
                  onDrop={file => console.log('uploaded file:', file)}
                />
              </UploaderWrapper>
              <FileAcceptNotice>Accepted format: JSON</FileAcceptNotice>
            </UploadFileWrapper>
          )}

          <ButtonWrapper>
            <div>
              <Button
                disabled={!selectedNetwork}
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

export default withContainer(ChooseNetWork);
