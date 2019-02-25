import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, PageHeading, Modal, ModalBody, ModalFooter } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { NetworkNameMapping, CENNZScanTxUrl } from 'common/types/cennznet-node.types';
import ClipboardShareLinks from './ClipboardShareLinks';

const ButtonGroup = styled.div`
  display: flex;
`;

const PaymentSentFormWrapper = styled.div``;

const Desc = styled.div`
  line-height: 1.2rem;
  a {
    color: ${colors.N0};
  }
`;

const Desc2 = styled.div`
  margin: 0.5rem 0.5rem 0 0;
  color: ${colors.N0};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2rem;
  margin-bottom: 1rem;
`;

const PaymentSentForm = ({ transaction }) => {
  const url = CENNZScanTxUrl.rimu; // TODO should base on selected network
  const { txHash } = transaction;
  return (
    <React.Fragment>
      <PaymentSentFormWrapper>
        <Desc>
          Your payment is processing. You can check the progress on <a href={url}>CENNZScan</a>
        </Desc>
        <Desc>
          We&apos;ll send you a notification when it&apos;s completed or if something goes wrong.
        </Desc>
        <div />
        <Desc2>Transaction hash</Desc2>

        <ClipboardShareLinks url={url}>{txHash}</ClipboardShareLinks>
      </PaymentSentFormWrapper>
    </React.Fragment>
  );
};

const TransferSentModal = ({
  isTransferSentModalOpen,
  setTransferSentModalOpen,
  getSendTxPayload,
  transaction,
}) => {
  return (
    <Modal isOpen={isTransferSentModalOpen}>
      <ModalBody>
        <PageHeading subHeading="">Payment sent</PageHeading>
        <PaymentSentForm {...{ transaction }} />
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button onClick={() => setTransferSentModalOpen(false)}>Close</Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default TransferSentModal;
