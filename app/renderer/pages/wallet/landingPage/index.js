import React from 'react';
import { Link } from 'react-router-dom';
import { MainContent, MainLayout } from 'components/layout';
import SVGInline from 'react-svg-inline';
import { PageHeading } from 'components';
import ROUTES from 'renderer/constants/routes';
import styled from 'styled-components';
import themeObject, { colors } from 'theme';
import connectIcon from 'renderer/assets/icon/connect.svg';
import plusIcon from 'renderer/assets/icon/plus.svg';
import withContainer from './container';

const WalletNavCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20vh;
`;

const WalletNavigation = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const defaultThemeStyle = p => {
  return {
    borderColor: colors.N0,
    borderHoverColor: colors.primary,
    borderHoverWidth: '3px',
    iconColor: colors.N0,
    iconHoverColor: colors.primary,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const CustomNavLink = ({ theme, themeKey, children, ...props }) => {
  return <Link {...props}>{children}</Link>;
};

const WalletNavCard = styled(CustomNavLink)`
  width: 12rem;
  height: 12rem;
  border: 1px solid ${p => computedThemeStyle(p).borderColor};
  box-sizing: border-box;
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    border: ${p =>
      `${computedThemeStyle(p).borderHoverWidth} solid ${computedThemeStyle(p).borderHoverColor}`};

    svg {
      g {
        g {
          stroke: ${p => computedThemeStyle(p).iconHoverColor};
        }
      }
    }
  }
`;

WalletNavCard.defaultProps = {
  theme: themeObject,
  themeKey: 'AppWalletNavCard',
};

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

// TODO: Extract to be reuable
const ThemableSVGInline = ({ theme, themeKey, children, ...props }) => {
  return <SVGInline {...props}>{children}</SVGInline>;
};

const PlusIcon = styled(ThemableSVGInline).attrs({
  svg: plusIcon,
})`
  svg {
    g {
      g {
        stroke: ${p => computedThemeStyle(p).iconColor};
      }
    }
  }
`;

PlusIcon.defaultProps = {
  theme: themeObject,
  themeKey: 'AppWalletNavCard',
};

const ConnectIcon = styled(ThemableSVGInline).attrs({
  svg: connectIcon,
})`
  svg {
    g {
      g {
        stroke: ${p => computedThemeStyle(p).iconColor};
      }
    }
  }
`;

ConnectIcon.defaultProps = {
  theme: themeObject,
  themeKey: 'AppWalletNavCard',
};

const WalletLandingPage = () => (
  // <MainLayout withoutSidebar>
  <MainLayout>
    <MainContent>
      <PageHeading subHeading="You haven't got an active wallet yet. Create a new one, or connect one of your existing ones.">
        Wallet
      </PageHeading>
      <WalletNavCardRow>
        <WalletNavigation>
          <WalletNavCard to={ROUTES.WALLET.CREATE}>
            <PlusIcon />
          </WalletNavCard>
          <MethodInfo>
            <MethodTitle>Create</MethodTitle>
            <MethodDesc>
              Don&apos;t have a wallet or want a new one? Create one and start managing your tokens.
            </MethodDesc>
          </MethodInfo>
        </WalletNavigation>
        <WalletNavigation>
          <WalletNavCard to={ROUTES.WALLET.CONNECT}>
            <ConnectIcon />
          </WalletNavCard>
          <MethodInfo>
            <MethodTitle>Connect</MethodTitle>
            <MethodDesc>
              Already have a wallet? Connect your existing wallet using your private key or seed
              phrase.
            </MethodDesc>
          </MethodInfo>
        </WalletNavigation>
      </WalletNavCardRow>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletLandingPage);
