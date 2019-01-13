import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import logoImg from 'renderer/assets/img/logo.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.N1000};
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.N1000};
  flex: 1 1 auto;
`;

const LogoContainer = styled.div`
  margin-left: -1rem;
`;

const NetworkSectionContainer = styled.div`
  width: 100%;
`;

const TopDownContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  min-width: 18rem;
`;

const LogoImg = styled.img.attrs({
  src: logoImg,
  alt: 'logo',
})`
  with: 5rem;
  height: 5rem;
`;

const HeaderSectionContainer = styled.div`
  flex-direction: column;
`;

const TopBar = ({networkName, blockNum, blockSpeed, isSynced, syncPercentage}) => (
  <Wrapper>
    <HeaderSectionContainer>
      <LogoContainer>
        <LogoImg />
      </LogoContainer>
    </HeaderSectionContainer>
    <HeaderWrapper>
      <NetworkSectionContainer>
        <TopDownContentWrapper>
          <div>{networkName}</div>
          <div>{blockNum}</div>
        </TopDownContentWrapper>
      </NetworkSectionContainer>
      <HeaderSectionContainer>
        <TopDownContentWrapper>
          <div>{isSynced ? '100% ' : syncPercentage + ' '} synced</div>
          <div>(block speed: {blockSpeed})</div>
        </TopDownContentWrapper>
      </HeaderSectionContainer>
    </HeaderWrapper>
  </Wrapper>
);

export default TopBar;
