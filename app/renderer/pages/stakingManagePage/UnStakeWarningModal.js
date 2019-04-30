import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { colors } from 'theme';
import { Logger } from 'renderer/utils/logging';

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
          Once confirmed that you would like to unstake, your account will stop staking at the end
          of the current era. Your account will still remain locked for an additional 72 hours after
          unstaking for security reasons.
        </p>
      </SubHeadingText>
    </Flex>
  );
};

const UnStakeWarningModal = ({
  isUnStakeWarningModalOpen,
  setUnStakeWarningModalOpen,
  onUnStake,
  stakingWallet,
  stakingAccount,
}) => {
  return (
    <Modal isOpen={isUnStakeWarningModalOpen} style={{ maxHeight: '20vh' }}>
      <ModalBody>
        <PageHeading subHeading={<SubHeading />}>Are you sure you want to unstake?</PageHeading>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button flat variant="nuetral" onClick={() => setUnStakeWarningModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => {
              Logger.debug('unStake yes click');
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
