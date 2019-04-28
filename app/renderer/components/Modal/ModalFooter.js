import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    footerPadding: '1rem',
    footerBorderTopColor: `1px solid ${colors.border}`,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ModalFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: ${p => computedThemeStyle(p).footerPadding};
  border-top: ${p => computedThemeStyle(p).footerBorderTopColor};
`;

ModalFooterWrapper.defaultProps = {
  theme,
  themeKey: 'Modal',
};

const ModalFooter = ({ children }) => <ModalFooterWrapper>{children}</ModalFooterWrapper>;

export default ModalFooter;
