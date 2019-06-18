import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PreDefinedAssetIdName } from 'common/types/theNode.types';
import { Button, PageHeading, Modal, ModalFooter, ModalBody, Form } from 'components';
import styled from 'styled-components';
import { colors } from 'theme';
import SVGInline from 'react-svg-inline';
import arrowCycleRightIcon from '../../../../assets/icon/arrow-cycle-right.svg';

const ArrowCycleRightIcon = styled(SVGInline).attrs({
  svg: arrowCycleRightIcon,
})`
  width: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const Wrapper = styled.div.attrs({
  className: '',
})`
  display: flex;
  height: 2rem;
`;

const WrapperBg = styled.div.attrs({
  className: '',
})`
  display: flex;
  height: 4rem;
  margin-bottom: 1rem;
  background: ${colors.background};
`;

const Icon = styled.div`
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Data = styled.div`
  flex: 1 auto;
  line-height: 1.2rem;
  padding: 1rem;
  min-width: 20vw;
  overflow-wrap: break-word;
  overflow: hidden;
`;

const DataSend = styled.div`
  display: flex;
  align-items: center;
  height: 4rem;
  padding-left: 1rem;
  font-size: 16px;
`;

const Label = styled.label`
  flex: 1 auto;
  margin: 0.5rem 0.5rem 0 0;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2rem;
`;

const SendTxConfirmForm = payload => {
  const sendValue = payload.amount + ' (' + PreDefinedAssetIdName[payload.assetId] + ')';
  return (
    <React.Fragment>
      <Wrapper>
        <Label>Send</Label>
      </Wrapper>
      <WrapperBg>
        <DataSend>{sendValue}</DataSend>
      </WrapperBg>

      <Wrapper>
        <Label>From</Label>
        <Icon />
        <Label>To</Label>
      </Wrapper>
      <WrapperBg>
        <Data>{payload.fromAddress}</Data>
        <Icon>
          <ArrowCycleRightIcon />
        </Icon>
        <Data>{payload.toAddress}</Data>
      </WrapperBg>
    </React.Fragment>
  );
};

const TransferConfirmModal = ({
  isTransferConfirmModalOpen,
  setTransferConfirmModalOpen,
  setTransferSentModalOpen,
  getSendTxPayload,
  onTransfer,
}) => {
  const payload = getSendTxPayload;
  return (
    <Modal isOpen={isTransferConfirmModalOpen}>
      <ModalBody>
        <PageHeading subHeading="">Confirm payment</PageHeading>
        <SendTxConfirmForm {...payload} />
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat variant="nuetral" onClick={() => setTransferConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              setTransferConfirmModalOpen(false);
              setTransferSentModalOpen(true);
              onTransfer(payload);
            }}
          >
            Confirm
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default TransferConfirmModal;
