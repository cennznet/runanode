import React from 'react';
import styled from 'styled-components';
import themeObject, { colors } from 'theme';
import { Scrollable } from 'components';

const defaultThemeStyle = p => {
  return {
    background: colors.V900,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5), 4px 0 8px 0 rgba(0, 0, 0, 0.14)',
    footerGradient: 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, #040c40 100%)',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 15rem;
  max-width: 15rem;
  height: 100%;
  font-weight: 500;
  background: ${p => computedThemeStyle(p).background};
  overflow: hidden;
  box-shadow: ${p => computedThemeStyle(p).boxShadow};
`;

const Footer = styled.div`
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${p => computedThemeStyle(p).footerGradient};
`;

const SubNav = ({ navItems, children, footer, ...props }) => (
  <Wrapper {...props}>
    <Scrollable themeStyle={{ height: `${footer ? 'calc(100% - 6rem)' : '100%'}` }}>
      {children}
    </Scrollable>
    {footer && <Footer {...props}>{footer}</Footer>}
  </Wrapper>
);

SubNav.defaultProps = {
  theme: themeObject,
  themeKey: 'AppSubNav',
};

export default SubNav;
