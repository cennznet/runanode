import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ROUTES from 'renderer/constants/routes';

const StyledLink = styled(Link)`
  color: ${colors.N0};
  height: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${colors.textHover};
  }
`;

const Text = styled.span`
  margin-left: 0.3rem;
`;

const BackLink = ({ to, children }) => {
  return (
    <StyledLink to={to}>
      <FontAwesomeIcon icon="arrow-left" />
      <Text>{children}</Text>
    </StyledLink>
  );
};

const StartOverLink = () => <BackLink to={ROUTES.WALLET.LANDING}>Start over</BackLink>;

export default StartOverLink;
