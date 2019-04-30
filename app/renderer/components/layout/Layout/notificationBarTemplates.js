import React from 'react';
import styled from 'styled-components';
import { colors } from 'theme';
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
        You’re currently staking. Please keep your node online and don’t quit the application. You
        can unstake
      </span>
      <StyledLink to={ROUTES.STAKING.MANAGE}>here</StyledLink>
    </div>
  );
};

const templateMapping = {
  STAKING_STARTED_NOTIFICATION: <StakingNotification />,
};

const getNotificationByType = type => {
  if (type in templateMapping) {
    return templateMapping[type];
  }
  return null;
};

export default getNotificationByType;
