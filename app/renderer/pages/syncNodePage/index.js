import React from 'react';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import withContainer from './container';
import { Logger } from '../../utils/logging';

const SyncNodeWrapper = styled.div`
  width: 70%;
`;

const SyncNodeTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const SyncNodeProgressWarpper = styled.div``;

const SyncNodeProgress = styled.div``;

const BlockNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TextWrapper = styled.div`
  font-size: 1rem;
  color: white;
  margin: 1rem auto;
`;

const SyncNodePage = ({ text, mainNetBestBlock, localNetBestBlock }) => {
  Logger.info(`TestPage: ${text}, ${mainNetBestBlock}, ${localNetBestBlock}`);
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
          <SyncNodeWrapper>
            <SyncNodeTitle>Main net</SyncNodeTitle>
            <SyncNodeProgressWarpper>
              {/* {progressPercentage > 0 && ( */}
              <Line
                percent={progressPercentage}
                trailColor="gray"
                trailWidth="8"
                strokeWidth="8"
                strokeColor="#1130FF"
                strokeLinecap="square"
              />
              {/* )} */}
              <TextWrapper>
                Main Net Best Block :<BlockNumber>{mainNetBestBlock}</BlockNumber>
              </TextWrapper>
              <TextWrapper>
                Local Node Best Block :<BlockNumber>{localNetBestBlock}</BlockNumber>
              </TextWrapper>
            </SyncNodeProgressWarpper>
          </SyncNodeWrapper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};

export default withContainer(SyncNodePage);
