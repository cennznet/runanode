import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import BN from 'bn.js';

import { colors } from 'theme';
import { environment } from 'common/environment';
import { chainNameMapping, NetworkNameMapping } from 'common/types/theNode.types';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import SideNav from 'components/layout/SideNav';
import SimpleSidebar from 'components/layout/SimpleSidebar'; // have to import like this to fix this issue: https://stackoverflow.com/questions/50428339/error-minified-react-error-130
import { PageFooter, Button } from 'components';
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

const SyncNodeDesc = styled.div`
  color: ${colors.textMuted};
  font-size: 0.8rem;
  margin-bottom: 1rem;
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
  localStorage,
  onRestartNode,
  navigateToCreateWallet,
  blocksNew,
  blocksRemote,
  onGetChainGetHeader,
  onNaviagteToChooseNetwork,
}) => {
  const selectedNetwork = localStorage[storageKeys.SELECTED_NETWORK];
  const { chain } = localNode;
  const isNetworkSwitched = selectedNetwork && selectedNetwork.value === chainNameMapping(chain);
  const genesisConfigFile = localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO];
  const genesisConfigFilePath = genesisConfigFile && genesisConfigFile.path;

  useEffect(() => {
    const interval = setInterval(() => {
      onGetChainGetHeader();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (selectedNetwork && selectedNetwork.value) {
      const targetChain =
        selectedNetwork.value === NetworkNameMapping.Development && genesisConfigFilePath
          ? genesisConfigFilePath
          : selectedNetwork.value;
      const currentNetwork = chainNameMapping(chain);
      Logger.debug(`selectedNetwork: ${JSON.stringify(selectedNetwork)}`);
      Logger.debug(`targetChain: ${targetChain}`);
      Logger.debug(`currentNetwork: ${currentNetwork}`);
      Logger.debug(`genesisConfigFilePath: ${genesisConfigFilePath}`);
      Logger.debug(`genesisConfigFile: ${JSON.stringify(genesisConfigFile)}`);
      Logger.debug(
        `localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO]: ${JSON.stringify(
          localStorage[storageKeys.GENESIS_CONFIG_FILE_INFO]
        )}`
      );
      if (
        (!targetChain.endsWith('json') && currentNetwork !== targetChain) || // for non-dev chain restart when they are different
        targetChain.endsWith('json') // always restart for dev chain
      ) {
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
    if (isNetworkSwitched) {
      const { blockHeight: localBestBlock } = blocksNew;
      const { blockHeight: remoteBestBlock } = blocksRemote;
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
              <Spinner size="xl" />
            </SpinnerWrapper>
          </MainContent>
        </LayoutWrapper>
      </Layout>
    );
  }

  const { blockHeight: syncedBlock, bps } = blocksNew;
  const { blockHeight: bestBlock } = blocksRemote;
  const syncNodeProgress = bestBlock && bestBlock > 0 ? syncedBlock / bestBlock : 0;
  const syncNodePercentage =
    syncNodeProgress >= 0.995 && syncNodeProgress < 1
      ? 99
      : syncNodeProgress >= 1
      ? 100
      : (syncNodeProgress * 100).toFixed(2);

  const estimateMin = (bestBlock - syncedBlock) / bps / 60;
  let estimateText = estimateMin && estimateMin >= 0 ? estimateMin.toFixed(2) : 0;
  if (estimateMin > 60) {
    estimateText = '>60';
  }

  return (
    <Layout sidebar={isDevOrDebugProd ? <SideNav /> : <SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent display="flex">
          <div>
            <SyncNodeTitle>{selectedNetwork ? selectedNetwork.label : 'Main net'}</SyncNodeTitle>
            <SyncNodeDesc>
              If this is your first time connecting to the network, it may take a while to load.
            </SyncNodeDesc>
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
                  {syncNodePercentage}% synced, {bps && bps >= 0 ? bps.toFixed(2) : 0} bps
                </TextWrapper>
                <TextWrapper>{`${syncedBlock} / ${bestBlock} blocks`}</TextWrapper>
                <TextWrapper>estimate: {estimateText} min</TextWrapper>
              </SyncNodeInfo>
            </SyncNodeProgressWarpper>
          </div>
          <PageFooter>
            <Button disabled={syncNodeProgress >= 1} onClick={() => onNaviagteToChooseNetwork()}>
              Change network
            </Button>
          </PageFooter>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(SyncNodePage);
