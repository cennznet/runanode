import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { PageHeading } from 'components';
import ROUTES from 'renderer/constants/routes';
import { Logger } from 'renderer/utils/logging';
import { getNetworkOptionPair } from 'renderer/pages/chooseNetworkPage';
import withContainer from './container';

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

const networkOptionMapping = {
  globalTestNet: 'Global test net',
  localTestNet: 'Local test net',
  mainNet: 'Main net',
};

const SyncNodePage = ({ syncStream, syncRemoteStream, localStorage }) => {
  const { SELECTED_NETWORK: selectedNetwork } = localStorage;

  const networkOption = getNetworkOptionPair(selectedNetwork);
  const { blockNum: bestBlock } = syncRemoteStream;
  const { blockNum: syncedBlock } = syncStream;
  const syncNodeProgress = bestBlock && bestBlock > 0 ? syncedBlock / bestBlock : 0;
  const syncNodePercentage =
    syncNodeProgress >= 0.995 && syncNodeProgress < 1
      ? 99
      : syncNodeProgress >= 1
      ? 100
      : (syncNodeProgress * 100).toFixed(2);

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
    // <Layout sidebar={<SimpleSidebar />}>
    <Layout defaultSidebar>
      <LayoutWrapper>
        <MainContent>
          <SyncNodeTitle>
            {getNetworkOptionPair(selectedNetwork)
              ? getNetworkOptionPair(selectedNetwork).label
              : 'Main net'}
          </SyncNodeTitle>
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
              <TextWrapper>{syncNodePercentage}% synced</TextWrapper>
              <TextWrapper>{`${syncedBlock} / ${bestBlock} blocks`}</TextWrapper>
            </SyncNodeInfo>
          </SyncNodeProgressWarpper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(SyncNodePage);
