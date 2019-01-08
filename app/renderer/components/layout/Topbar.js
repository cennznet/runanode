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
  margin-left: -17px;
`;

const NetworkSectionContainer = styled.div`
  width: 100%;
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
      <div>Local test net</div>
      <div>#0123456789045678</div>
    </NetworkSectionContainer>
    <HeaderSectionContainer>
      <div>100% synced</div>
      <div>(block height: 370,985)</div>
    </HeaderSectionContainer>
  </Wrapper>
);

export default Topbar;
