import React from 'react';
import ReactModal from 'react-modal';
import Button from 'components/Button';

const Modal = ({ isOpen, onOpenModal, onCloseModal, styles, children, ...restProps }) => (
  <Modal
    isOpen={isOpen}
    onAfterOpen={onOpenModal}
    onRequestClose={onCloseModal}
    style={styles}
    contentLabel="Example Modal"
  >
    <Button onClick={onCloseModal}>close</Button>
  </Modal>
);

export default Modal;
