import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const Modal = ({
  isOpen,
  onOpenModal,
  onCloseModal,
  styles,
  children,
  className,
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
      {children}
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
  maxWidth: '70vw',
  maxHeight: '50vh',
  backgroundColor: '#040C40',
  boxShadow: `0 2px 4px 0 ${colors.N900}`,
  overlayBgColor: 'rgba(54, 58, 61, 0.7)',
};

export default StyledModal;
