import React from 'react';
import Button from 'components/Button';
import { MainContent } from 'components/layout';
import MainLayout from 'renderer/components/layout/MainLayout';
import styled from 'styled-components';
import * as colors from '../../theme/colors';
import withContainer from './dev.container';

const PageTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
`;

const Flex = styled.div`
  display: flex;
  margin-top: 1rem;
  & > * {
    margin-right: 1rem;
  }
`;

const DevPage = ({ onNetworkStatusClick, onRestartNodeClick, nodeSystem }) => {
  const { chain, name, version, health } = nodeSystem;
  const networkStatus = `${chain} ${version} (status:${health.message}, sync:${health.isSyncing}, peers:${health.peers}, name:${name})`;
  return (
    <MainLayout>
      <MainContent>
        <PageTitle>
          <h1>Dev Page</h1>
        </PageTitle>
        <Flex>
          <Button onClick={onNetworkStatusClick}>Get Network Status</Button>
          <div>
            {networkStatus}
          </div>
        </Flex>
        <Flex>
          <Button onClick={onRestartNodeClick}>Restart node</Button>
        </Flex>
      </MainContent>
    </MainLayout>
  );
};
export default withContainer(DevPage);
