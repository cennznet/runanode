import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const ModalBodyWrapper = styled.div`
  padding: 2rem;
`;

export const ModalBody = ({ children }) => <ModalBodyWrapper>{children}</ModalBodyWrapper>;
