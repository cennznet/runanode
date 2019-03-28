import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { environment } from 'common/environment';
import { colors } from 'renderer/theme';
import ROUTES from 'renderer/constants/routes';
import { openExternalLink } from 'renderer/utils/utils';
import appConfig from 'app/config';

const { isDevOrDebugProd } = environment;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 5rem;
`;

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  font-size: 1rem;
  color: ${colors.textMuted};
  text-decoration: none;

  &.active {
    color: ${colors.N0};
  }

  &:hover:not(.active) {
    background-color: ${colors.V500};
  }
`;


const IconLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  font-size: 1rem;
  color: ${colors.textMuted};
  text-decoration: none;

  &.active {
    color: ${colors.N0};
  }

  &:hover:not(.active) {
    background-color: ${colors.V500};
  }
`;

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
  background-color: ${colors.V900};
  box-shadow: 4px 0 8px 0 rgba(0, 0, 0, 0.14);
`;

const TopIcons = styled.div``;
const BottomIcons = styled.div``;
const IconWrapper = styled.div`
  text-align: center;
`;

const SideNav = () => {
  return (
    <Wrapper>
      <IconNav>
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
          <IconDiv onClick={() => openExternalLink(appConfig.app.faqLink)}>
            <IconWrapper>
              <FontAwesomeIcon icon="question-circle" />
              <IconText>FAQ</IconText>
            </IconWrapper>
          </IconDiv>
        </BottomIcons>
      </IconNav>
    </Wrapper>
  );
};

export default SideNav;
