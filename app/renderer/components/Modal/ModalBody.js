import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
  return {
    contentPadding: '2rem',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ModalBodyWrapper = styled.div`
  padding: ${p => computedThemeStyle(p).contentPadding};
`;

ModalBodyWrapper.defaultProps = {
  theme,
  themeKey: 'Modal',
};

const ModalBody = ({ children }) => <ModalBodyWrapper>{children}</ModalBodyWrapper>;

export default ModalBody;
