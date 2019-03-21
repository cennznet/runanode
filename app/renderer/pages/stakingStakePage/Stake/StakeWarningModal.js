import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Checkbox, PageHeading, Modal, ModalBody, ModalFooter } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

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
          While staking it is important to not go offline. Leaving the network, or quitting the
          application will result in a loss of some of your staking assets. You will also be removed
          from the validator list.
        </p>
        <p>
          While staking, this account will be completely locked. This means you won't be able to
          send any transactions until you've unstaked.
        </p>
      </SubHeadingText>
    </Flex>
  );
};

const StakeWarningModal = ({
  isStakeWarningModalOpen,
  setStakeWarningModalOpen,
  setStakeConfirmModalOpen,
}) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <Modal isOpen={isStakeWarningModalOpen}>
      <ModalBody>
        <PageHeading subHeading={<SubHeading />}>WARNING</PageHeading>
      </ModalBody>
      <ModalFooter>
        <Flex>
          <Button
            onClick={() => {
              setStakeWarningModalOpen(false);
            }}
            style={{ marginRight: '0.5rem' }}
            color="nuetral"
            flat
          >
            Cancel
          </Button>
          <Button
            disabled={!isChecked}
            onClick={() => {
              setStakeWarningModalOpen(false);
              setStakeConfirmModalOpen(true);
            }}
          >
            I understand
          </Button>
        </Flex>
        <Checkbox
          checked={isChecked}
          onChange={() => {
            setChecked(!isChecked);
          }}
        >
          I understand the risk
        </Checkbox>
      </ModalFooter>
    </Modal>
  );
};

export default StakeWarningModal;
