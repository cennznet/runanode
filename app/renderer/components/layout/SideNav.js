import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { environment } from 'common/environment';
import themeObject, { colors } from 'theme';
import ROUTES from 'renderer/constants/routes';
import { openExternalLink } from 'renderer/utils/utils';
import config from 'app/config';

const defaultThemeStyle = p => {
  return {
    background: colors.background,
    navItemColor: colors.textMuted,
    navItemHoverBackground: colors.V500,
    navItemHoverColor: colors.N0,
    navItemActiveColor: colors.N0,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const { isDevOrDebugProd } = environment;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 5rem;
`;

const ExternalLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  font-size: 1rem;
  color: ${p => computedThemeStyle(p).navItemColor};
  text-decoration: none;

  &.active {
    color: ${p => computedThemeStyle(p).navItemActiveColor};
  }

  &:hover:not(.active) {
    background: ${p => computedThemeStyle(p).navItemHoverBackground};
    color: ${p => computedThemeStyle(p).navItemHoverColor};
  }
`;

ExternalLink.defaultProps = {
  theme: themeObject,
  themeKey: 'AppSideNav',
};

const CustomNavLink = ({ theme, themeKey, children, ...props }) => {
  return <NavLink {...props}>{children}</NavLink>;
};

const IconLink = styled(CustomNavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  font-size: 1rem;
  color: ${p => computedThemeStyle(p).navItemColor};
  text-decoration: none;

  &.active {
    color: ${p => computedThemeStyle(p).navItemActiveColor};
  }

  &:hover:not(.active) {
    background: ${p => computedThemeStyle(p).navItemHoverBackground};
    color: ${p => computedThemeStyle(p).navItemHoverColor};
  }
`;

IconLink.defaultProps = {
  theme: themeObject,
  themeKey: 'AppSideNav',
};

const IconText = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 12px;
`;

const IconNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 5rem;
  background: ${p => computedThemeStyle(p).background};
  box-shadow: 4px 0 8px 0 rgba(0, 0, 0, 0.14);
`;

IconNav.defaultProps = {
  theme: themeObject,
  themeKey: 'AppSideNav',
};

const TopIcons = styled.div``;
const BottomIcons = styled.div``;
const IconWrapper = styled.div`
  text-align: center;
`;

const SideNav = ({ theme, themeKey }) => {
  const { faqUrl } = config.branding;
  return (
    <Wrapper>
      <IconNav {...{ theme, themeKey }}>
        <TopIcons>
          <IconLink to={ROUTES.WALLET.ROOT}>
            <IconWrapper>
              <FontAwesomeIcon icon="wallet" />
              <IconText>Wallet</IconText>
            </IconWrapper>
          </IconLink>
          <IconLink to={ROUTES.STAKING.ROOT}>
            <IconWrapper>
              <FontAwesomeIcon icon="chart-pie" />
              <IconText>Staking</IconText>
            </IconWrapper>
          </IconLink>
          <IconLink to={ROUTES.SETTINGS.ROOT}>
            <IconWrapper>
              <FontAwesomeIcon icon="cogs" />
              <IconText>Settings</IconText>
            </IconWrapper>
          </IconLink>
        </TopIcons>
        <BottomIcons>
          {isDevOrDebugProd && (
            <IconLink to="/dev">
              <FontAwesomeIcon icon={['fab', 'dev']} />
            </IconLink>
          )}
          {faqUrl && (
            <ExternalLink {...{ theme, themeKey }} onClick={() => openExternalLink(faqUrl)}>
              <IconWrapper>
                <FontAwesomeIcon icon="question-circle" />
                <IconText>FAQ</IconText>
              </IconWrapper>
            </ExternalLink>
          )}
        </BottomIcons>
      </IconNav>
    </Wrapper>
  );
};

export default SideNav;
