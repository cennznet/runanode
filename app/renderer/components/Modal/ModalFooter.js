import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const ModalFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 1rem;
  border-top: ${p => `1px solid ${colors.border}`};
`;

const ModalFooter = ({ children }) => <ModalFooterWrapper>{children}</ModalFooterWrapper>;

export default ModalFooter;
