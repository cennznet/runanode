import React from 'react';
import ReactModal from 'react-modal';
import Button from 'components/Button';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import ModalFooter from './lib/modalFooter';

const ModalContent = styled.div`
  padding: 1rem;
`;

const ModalFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 1rem;
  border-top: ${p => `1px solid ${colors.N500}`};
`;

const Modal = ({
  isOpen,
  onOpenModal,
  onCloseModal,
  styles,
  children,
  className,
  footerComp,
  ...restFooterProps
}) => {
  const contentClassName = `${className}__content`;
  const overlayClassName = `${className}__overlay`;

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onOpenModal}
      onRequestClose={onCloseModal}
      className={contentClassName}
      overlayClassName={overlayClassName}
      ariaHideApp={false}
    >
      <ModalContent>{children}</ModalContent>
      {footerComp && <ModalFooterWrapper>{footerComp}</ModalFooterWrapper>}
    </ReactModal>
  );
};

const StyledModal = styled(Modal)`
  &__overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: ${p => p.overlayBgColor || 'rgba(255, 255, 255, 0.55)'};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__content {
    position: absolute;
    border-radius: 3px;
    min-width: ${p => p.minWith || '50vw'};
    min-height: ${p => p.minWith || '25vh'};
    background-color: ${p => p.backgroundColor || '#040c40'};
    box-shadow: ${p => p.boxShadow || `0 2px 4px 0 ${colors.N900}`};
    color: ${p => p.color || colors.N0};
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    :focus {
      outline: 0;
    }
  }
`;

export default StyledModal;
