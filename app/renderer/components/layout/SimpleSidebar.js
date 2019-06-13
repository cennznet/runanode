import React from 'react';
import styled from 'styled-components';
import theme, { colors } from 'theme';
import logo from '../../assets/img/node-logo.png';
import packageJson from '../../../../package.json';

const defaultThemeStyle = p => {
  return {
    background: colors.V900,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 20rem;
  padding: 5rem;
  background: ${p => computedThemeStyle(p).background};
`;

const SimpleSidebar = p => (
  <Wrapper {...p}>
    <img alt="Logo" src={logo} />
    <div>Version: {packageJson.version}</div>
  </Wrapper>
);

SimpleSidebar.defaultProps = {
  theme,
  themeKey: 'AppSimpleSidebar',
};

export default SimpleSidebar;
