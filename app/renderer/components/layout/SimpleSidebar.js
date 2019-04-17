import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import logoImg from '../../assets/img/cennznode-logo.png';
import packageJson from '../../../../package.json';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 20rem;
  padding: 5rem;
  background: ${colors.V900};
`;

const Sidebar = () => (
  <Wrapper>
    <img alt="" src={logoImg} />
    <div>Version: {packageJson.version}</div>
  </Wrapper>
);

export default Sidebar;
