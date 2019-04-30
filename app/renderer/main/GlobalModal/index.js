import React from 'react';
import styled from 'styled-components';
import { colors } from 'theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withContainer from './container';
import ExitAppWhileStakingModal from './ExitAppWhileStakingModal';

const GlobalModal = ({ isOpen, onToggleGlobalModal, modalType }) => {
  if (modalType === 'EXIT_APP_WHILE_STAKING_MODAL') {
    return <ExitAppWhileStakingModal {...{ isOpen, onToggleGlobalModal, modalType }} />;
  }
  return null;
};

export default withContainer(GlobalModal);
