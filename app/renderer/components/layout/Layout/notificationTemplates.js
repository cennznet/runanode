import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { Link } from 'react-router-dom';
import ROUTES from 'renderer/constants/routes';

const StyledLink = styled(Link)`
  margin-left: 3px;
  color: ${colors.N800};
`;

const StakingNotification = () => {
  return (
    <div>
      <span>
        You are currently staking. Please keep your node online, and do not quit the application.
        You can unstake
      </span>
      <StyledLink to={ROUTES.STAKING.OVERVIEW}>here</StyledLink>
    </div>
  );
};

const getNotificationByType = type => {
  if (type === 'STAKING_NOTIFICATION') {
    return <StakingNotification />;
  }

  return null;
};

export default getNotificationByType;
