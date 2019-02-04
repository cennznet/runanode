import React from 'react';
import ReactModal from 'react-modal';
import Button from 'components/Button';
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors } from 'renderer/theme';

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
  footer,
  ...restProps
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
      {...restProps}
    >
      <ModalContent>{children}</ModalContent>
      {footer && <ModalFooterWrapper>{footer}</ModalFooterWrapper>}
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
    background-color: ${p => p.overlayBgColor};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__content {
    position: absolute;
    border-radius: 3px;
    min-width: ${p => p.minWidth};
    min-height: ${p => p.minHeight};
    max-width: ${p => p.maxWidth};
    max-height: ${p => p.maxHeight};
    background-color: ${p => p.backgroundColor};
    box-shadow: ${p => p.boxShadow};
    color: ${p => p.color || colors.N0};
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    :focus {
      outline: 0;
    }
  }
`;

StyledModal.defaultProps = {
  minWidth: '50vw',
  minHeight: '25vh',
  maxWidth: '65vw',
  maxHeight: '40vh',
  backgroundColor: '#040C40',
  boxShadow: `0 2px 4px 0 ${colors.N900}`,
  overlayBgColor: rgba(colors.N800, 0.7),
};

export default StyledModal;
