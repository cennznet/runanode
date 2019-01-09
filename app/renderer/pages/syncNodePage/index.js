import React from 'react';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Logger } from 'renderer/utils/logging';
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
`;

const SyncNodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  margin-left: 1rem;
`;

const BlockNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TextWrapper = styled.div`
  font-size: 1rem;
  color: white;
`;

const SyncNodePage = ({ text, mainNetBestBlock, localNetBestBlock }) => {
  const syncNodePercentage =
    mainNetBestBlock && mainNetBestBlock > 0 ? (localNetBestBlock / mainNetBestBlock) * 100 : 0;
  const progressPercentage = syncNodePercentage >= 100 ? 100 : syncNodePercentage;

  Logger.info(`
  ===========================================    
  Best block in MainNet #${mainNetBestBlock} 
  ===========================================`);
  Logger.info(`
  ===========================================
  Best block in Local #${localNetBestBlock}
  ===========================================`);
  Logger.info(`  Sync progress in Local ${progressPercentage.toFixed(2)}%`);
  return (
    <Layout sidebar={<SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <SyncNodeTitle>Main net</SyncNodeTitle>
          <SyncNodeProgressWarpper>
            <SyncNodeProgress>
              {/* {progressPercentage > 0 && ( */}
              <Line
                percent={progressPercentage}
                trailColor={colors.N700}
                trailWidth="8"
                strokeWidth="8"
                strokeColor={colors.primary}
                strokeLinecap="butt"
              />
              {/* )} */}
            </SyncNodeProgress>
            <SyncNodeInfo>
              <TextWrapper>
                <BlockNumber>
                  {progressPercentage === 100 || progressPercentage === 0
                    ? progressPercentage
                    : progressPercentage.toFixed(2)}
                </BlockNumber>
                % synced
              </TextWrapper>
              <TextWrapper>{`${localNetBestBlock} / ${mainNetBestBlock} blocks`}</TextWrapper>
            </SyncNodeInfo>
          </SyncNodeProgressWarpper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(SyncNodePage);
