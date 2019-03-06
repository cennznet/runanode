import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { colors } from 'renderer/theme';

const ButtonGroup = styled.div`
  display: flex;
`;

const Flex = styled.div`
  display: flex;
`;

const SubHeadingText = styled.div`
  margin-left: 0.5rem;
`;

const SubHeading = () => {
  return (
    <Flex>
      <div>
        <FontAwesomeIcon icon="exclamation-circle" color={colors.warning} />
      </div>
      <SubHeadingText>
        <p>
          Once you confirm unstake,your account will stop to stake. It will keep locked until 72 hours later for security reason.
        </p>
      </SubHeadingText>
    </Flex>
  );
};

const UnStakeWarningModal = ({ isUnStakeWarningModalOpen, setUnStakeWarningModalOpen, onUnStake, stakingWallet, stakingAccount }) => {
  return (
    <Modal isOpen={isUnStakeWarningModalOpen} style={{maxHeight: '20vh'}}>
      <ModalBody>
        <PageHeading subHeading={<SubHeading />}>
          Are you sure you want to unstake?
        </PageHeading>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat color="nuetral" onClick={() => setUnStakeWarningModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="danger"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              setUnStakeWarningModalOpen(false);
              onUnStake({
                wallet: stakingWallet,
                stashAccountAddress: stakingAccount.address,
                passphrase: '',
              });
            }}
          >
            Yes
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default UnStakeWarningModal;
