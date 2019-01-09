import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import cennzNodeLogo from 'renderer/assets/img/logo.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.N1000};
`;

const LogoContainer = styled.div`
  margin-left: -16px;
`;

const NetworkSectionContainer = styled.div`
  width: 100%;
  margin-left: -66px;
`;

const TopDownContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 3rem;
`;

const LogoImg = styled.img.attrs({
  src: cennzNodeLogo,
  alt: 'Cennz-node logo',
  width: '80px',
  height: '80px',
})`
`;

const HeaderSectionContainer = styled.div`
  flex: 0 0 12em;
  flex-direction: column;
`;

const Topbar = () => (
  <Wrapper>
    <HeaderSectionContainer>
      <LogoContainer>
        <LogoImg />
      </LogoContainer>
    </HeaderSectionContainer>
    <NetworkSectionContainer>
      <TopDownContentWrapper>
        <div>Local test net</div>
        <div>#0123456789045678</div>
      </TopDownContentWrapper>
    </NetworkSectionContainer>
    <HeaderSectionContainer>
      <TopDownContentWrapper>
        <div>100% synced</div>
        <div>(block height: 370,985)</div>
      </TopDownContentWrapper>
    </HeaderSectionContainer>
  </Wrapper>
);

export default Topbar;
