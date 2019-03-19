import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import { colors } from 'renderer/theme';
import { environment } from 'common/environment';
import { chainNameMapping, NetworkNameMapping } from 'common/types/cennznet-node.types';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import SideNav from 'components/layout/SideNav';
import SimpleSidebar from 'components/layout/SimpleSidebar'; // have to import like this to fix this issue: https://stackoverflow.com/questions/50428339/error-minified-react-error-130
import { Logger } from 'renderer/utils/logging';
import { storageKeys } from 'renderer/api/utils/storage';
import Spinner from 'components/Spinner';
import withContainer from './container';

const { isDevOrDebugProd } = environment;

const SpinnerWrapper = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const SyncNodeTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const SyncNodeProgressWarpper = styled.div`
  display: flex;
`;

const SyncNodeProgress = styled.div`
  width: 60%;
  border-radius: 3px;
  border: 3px solid ${colors.primary};
`;

const SyncNodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  margin-left: 1rem;
`;

const TextWrapper = styled.div`
  color: ${colors.N0};
`;

const SyncNodePage = ({
  nodeSystem: { localNode },
  syncStream,
  syncRemoteStream,
  localStorage,
  onRestartNode,
  navigateToCreateWallet,
}) => {
  const selectedNetwork = localStorage[storageKeys.SELECTED_NETWORK];
  const { chain } = localNode;
  const isNetworkSwitched = selectedNetwork && selectedNetwork.value === chainNameMapping(chain);
  const genesisConfigFile = localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO];
  const genesisConfigFilePath = genesisConfigFile && genesisConfigFile.path;
  Logger.debug(`selectedNetwork: ${JSON.stringify(selectedNetwork)}`);
  Logger.debug(`chain: ${chain}`);
  Logger.debug(`isNetworkSwitched: ${isNetworkSwitched}`);

  useEffect(() => {
    Logger.debug(`SyncNode page: check whether to restart node`);
    if (selectedNetwork && selectedNetwork.value) {
      const targetChain =
        selectedNetwork.value === NetworkNameMapping.Development && genesisConfigFilePath
          ? genesisConfigFilePath
          : selectedNetwork.value;
      const currentNetwork = chainNameMapping(chain);
      if (currentNetwork !== targetChain) {
        Logger.debug(`restart node to use ${targetChain}`);
        onRestartNode({ chain: targetChain });
      } else {
        Logger.debug(`same network skip restart. ${currentNetwork}`);
      }
    } else {
      onRestartNode();
    }
  }, []);

  useEffect(() => {
    // TODO: Error display in precentage bar
    Logger.debug(`SyncNode page: precentage cal`);
    if (isNetworkSwitched) {
      const { blockNum: localBestBlock } = syncStream;
      const { blockNum: remoteBestBlock } = syncRemoteStream;
      if (localBestBlock !== null && remoteBestBlock !== null) {
        const syncPercentage = localBestBlock / remoteBestBlock;
        if (syncPercentage >= 1) {
          navigateToCreateWallet();
        }
      }
    }
  });

  if (!isNetworkSwitched) {
    return (
      <Layout sidebar={isDevOrDebugProd ? <SideNav /> : <SimpleSidebar />}>
        <LayoutWrapper>
          <MainContent>
            <SpinnerWrapper>
              <Spinner size="2.5rem" />
            </SpinnerWrapper>
          </MainContent>
        </LayoutWrapper>
      </Layout>
    );
  }

  const { blockNum: bestBlock } = syncRemoteStream;
  const { blockNum: syncedBlock, bps } = syncStream;
  const syncNodeProgress = bestBlock && bestBlock > 0 ? syncedBlock / bestBlock : 0;
  const syncNodePercentage =
    syncNodeProgress >= 0.995 && syncNodeProgress < 1
      ? 99
      : syncNodeProgress >= 1
      ? 100
      : (syncNodeProgress * 100).toFixed(2);

  const estimateMin = (bestBlock - syncedBlock) / bps / 60;

  Logger.info(`
  ===========================================
  Best block in MainNet #${bestBlock}
  ===========================================`);
  Logger.info(`
  ===========================================
  Best block in Local #${syncedBlock}
  ===========================================`);
  Logger.info(`  Sync progress in Local ${syncNodePercentage}%`);

  return (
    <Layout sidebar={isDevOrDebugProd ? <SideNav /> : <SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <SyncNodeTitle>{selectedNetwork ? selectedNetwork.label : 'Main net'}</SyncNodeTitle>
          <SyncNodeProgressWarpper>
            <SyncNodeProgress>
              <Line
                percent={syncNodePercentage}
                trailColor="transparent"
                trailWidth="7"
                strokeWidth="7"
                strokeColor={colors.primary}
                strokeLinecap="square"
                style={{ height: '100%', width: '100%' }}
              />
            </SyncNodeProgress>
            <SyncNodeInfo>
              <TextWrapper>
                {syncNodePercentage}% synced, {bps ? bps.toFixed(2) : 0} bps
              </TextWrapper>
              <TextWrapper>{`${syncedBlock} / ${bestBlock} blocks`}</TextWrapper>
              <TextWrapper>estimate: {estimateMin ? estimateMin.toFixed(2) : 0} min</TextWrapper>
            </SyncNodeInfo>
          </SyncNodeProgressWarpper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(SyncNodePage);
