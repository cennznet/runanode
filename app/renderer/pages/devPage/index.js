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

const DevPage = ({ onNetworkStatusClick, onGetHeaderClick, onGetRemoteHeaderClick, onRestartNodeClick, onStream, onChainSubscribeNewHead, nodeSystem, syncStream, syncRemoteStream }) => {
  const { chain, name, version, health } = nodeSystem;
  const networkStatus = `${chain} ${version} (status:${health.message}, sync:${health.isSyncing}, peers:${health.peers}, name:${name})`;

  function getStreamStatus(streamState) {
    const { isConnected, latency, signalLevel, blockNum, previousBlockNum, bps } = streamState;
    const steamStatus = `bps: ${bps}, previousBlockNum: ${previousBlockNum}, blockNum: ${blockNum}, isConnected: ${isConnected}, latency: ${latency}, signalLevel: ${signalLevel}`;
    return steamStatus;
  }

  const syncSteamStatus = getStreamStatus(syncStream);
  const syncRemoteSteamStatus = getStreamStatus(syncRemoteStream);

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
          <Button onClick={onGetHeaderClick}>Get Header</Button>
          <div>
            {syncSteamStatus}
          </div>
        </Flex>
        <Flex>
          <Button onClick={onGetRemoteHeaderClick}>Get RemoteHeader</Button>
          <div>
            {syncRemoteSteamStatus}
          </div>
        </Flex>
        <Flex>
          <Button onClick={onRestartNodeClick}>Restart node</Button>
        </Flex>
        <Flex>
          <Button onClick={onStream}>start stream</Button>
          <div>
            {syncSteamStatus}
          </div>
          <div>
            {syncRemoteSteamStatus}
          </div>
        </Flex>
        <Flex>
          <Button onClick={onChainSubscribeNewHead}>start chainSubscribeNewHead</Button>
        </Flex>
      </MainContent>
    </MainLayout>
  );
};
export default withContainer(DevPage);
