import React from 'react';
import { Button, PageHeading, Modal } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STEPS } from '../constants';

const ModalWarningWrapper = styled.div`
  display: flex;
`;

const ModalWarningDetails = styled.div`
  margin-left: 0.5rem;
  line-height: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const SwitchNetworkWarningModal = ({ isOpenNetworkWarningModal, setIsOpenNetworkWarningModal }) => (
  <Modal
    isOpen={isOpenNetworkWarningModal}
    footer={
      <ButtonGroup>
        <Button flat color="nuetral" onClick={() => setIsOpenNetworkWarningModal(false)}>
          Cancel
        </Button>
        <Button
          style={{ marginLeft: '0.5rem' }}
          color="warning"
          onClick={() => {
            console.log('Yes');
          }}
        >
          Yes
        </Button>
      </ButtonGroup>
    }
  >
    <PageHeading>Are you sure you want to change network?</PageHeading>
    <ModalWarningWrapper>
      <div>
        <FontAwesomeIcon icon="exclamation-circle" size="sm" color={colors.warning} />
      </div>
      <ModalWarningDetails>
        <div>
          Only change the network if you know what you are doing. If you would like to know the
          difference between the networks click this.
        </div>
        <div>
          Once you change the network, all the blocks in the new network will need to be synced.
        </div>
      </ModalWarningDetails>
    </ModalWarningWrapper>
  </Modal>
);

export default SwitchNetworkWarningModal;
