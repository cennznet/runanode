import React from 'react';
import styled from 'styled-components';
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
`;

const SyncNodeInformation = styled.div``;

const TextWrapper = styled.div`
  font-size: 1rem;
  color: white;
`;

const TestPage = ({ text, mainNetBestBlock, localNetBestBlock }) => {
  console.log('mainNetBestBlock', mainNetBestBlock);
  console.log('localNetBestBlock', localNetBestBlock);
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
          <TextWrapper>Local test net</TextWrapper>
          <TextWrapper>MianNet Best Block :{mainNetBestBlock}</TextWrapper>
          <TextWrapper>Local Node Best Block :{localNetBestBlock}</TextWrapper>
        </SyncNodeInformation>
      </SyncNodeContainer>
    </PageContainer>
  );
};

export default withContainer(TestPage);
