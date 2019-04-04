import React from 'react';
import { Link } from 'react-router-dom';
import { MainContent, MainLayout } from 'components/layout';
import SVGInline from 'react-svg-inline';
import { Button, PageHeading } from 'components';
import ROUTES from 'renderer/constants/routes';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import connectIcon from 'renderer/assets/icon/connect.svg';
import plusIcon from 'renderer/assets/icon/plus.svg';
import withContainer from './container';

const GenWallteMethodsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20vh;
`;

const GenerateWalletMethods = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GalleryBox = styled(Link)`
  box-sizing: border-box;
  width: 12rem;
  height: 12rem;
  border: 1px solid white;
  border-radius: 27px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    box-sizing: border-box;
    border: 3px solid ${colors.primary};
  }
`;

const MethodInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 15rem;
  align-items: center;
  margin: 1rem;
`;

const MethodTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const MethodDesc = styled.div`
  margin: 1rem 0.5rem;
  text-align: center;
  line-height: 1.2rem;
`;

const PlusIcon = styled(SVGInline).attrs({
  svg: plusIcon,
})`
  width: auto;
`;

const ConnectIcon = styled(SVGInline).attrs({
  svg: connectIcon,
})`
  width: auto;
`;

const WalletLandingPage = () => (
  // <MainLayout withoutSidebar>
  <MainLayout>
    <MainContent>
      <PageHeading subHeading="You haven't got an active wallet yet. Create a new one, or connect one of your existing ones.">
        Wallet
      </PageHeading>
      <GenWallteMethodsWrapper>
        <GenerateWalletMethods>
          <GalleryBox to={ROUTES.WALLET.CREATE}>
            <div>
              <PlusIcon />
            </div>
          </GalleryBox>
          <MethodInfo>
            <MethodTitle>Create</MethodTitle>
            <MethodDesc>
              Don&apos;t have a wallet or want a new one? Create one and start managing your tokens.
            </MethodDesc>
          </MethodInfo>
        </GenerateWalletMethods>
        <GenerateWalletMethods>
          <GalleryBox to={ROUTES.WALLET.CONNECT}>
            <div>
              <ConnectIcon />
            </div>
          </GalleryBox>
          <MethodInfo>
            <MethodTitle>Connect</MethodTitle>
            <MethodDesc>
              Already have a wallet? Connect your existing wallet using your private key or seed
              phrase.
            </MethodDesc>
          </MethodInfo>
        </GenerateWalletMethods>
      </GenWallteMethodsWrapper>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletLandingPage);
