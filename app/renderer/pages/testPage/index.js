import React from 'react';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import cennzNodeLogo from '../../assets/img/cennznode-logo.png';
import withContainer from './container';
import packageJson from '../../../../package.json';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 32vw;
  height: 100vh;
  background-color: #000000;
`;

const LogoContainer = styled.div`
  height: 60vh;
  margin: 5rem auto;
`;

const LogoImg = styled.img.attrs({
  src: cennzNodeLogo,
  alt: 'Cennz-node logo',
})`
  width: auto;
`;

const VersionContainer = styled.div`
  font-size: 1rem;
  text-align: center;
  color: white;
`;

const SyncNodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68vw;
  height: 100vh;
  background-color: #1e2022;
  padding: 1rem;
`;

const SyncNodeInformation = styled.div`
  width: 100%;
  text-align: center;
`;

const BlockNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

const SyncNodeTitle = styled.div`
  color: white;
  font-size: 1.5rem;
  margin: 1rem;
  font-weight: 700;
`;

const TextWrapper = styled.div`
  font-size: 1rem;
  color: white;
  margin: 1rem auto;
`;

const TestPage = ({ text, mainNetBestBlock, localNetBestBlock }) => {
  const syncNodePrecentage = (localNetBestBlock / mainNetBestBlock) * 100;
  const progressPrecentage = syncNodePrecentage >= 100 ? 100 : syncNodePrecentage;

  console.log(`
  ===========================================    
  Best block in MainNet #${mainNetBestBlock} 
  ===========================================`);
  console.log(`
  ===========================================
  Best block in Local #${localNetBestBlock}
  ===========================================`);
  console.log(`  Sync progress in Local ${progressPrecentage.toFixed(2)}%`);
  return (
    <PageContainer>
      <BrandContainer>
        <LogoContainer>
          <LogoImg />
        </LogoContainer>
        <VersionContainer>{`Version ${packageJson.version}`}</VersionContainer>
      </BrandContainer>
      <SyncNodeContainer>
        <SyncNodeInformation>
          <SyncNodeTitle>Local test net</SyncNodeTitle>
          {/* {progressPrecentage > 0 && ( */}
          <Line
            percent={progressPrecentage}
            trailColor="gray"
            trailWidth="1"
            strokeWidth="2"
            strokeColor="#1130FF"
          />
          {/* )} */}
          <TextWrapper>
            Mian Net Best Block :<BlockNumber>{mainNetBestBlock}</BlockNumber>
          </TextWrapper>
          <TextWrapper>
            Local Node Best Block :<BlockNumber>{localNetBestBlock}</BlockNumber>
          </TextWrapper>
        </SyncNodeInformation>
      </SyncNodeContainer>
    </PageContainer>
  );
};

export default withContainer(TestPage);
