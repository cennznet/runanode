import React from 'react';
import { Grid, Cell } from 'styled-css-grid';
import { PreDefinedAssetIdName, PreDefinedAssetId } from 'common/types/cennznet-node.types';
import { Button, PageHeading, Modal, ModalBody, ModalFooter } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const FieldWrapper = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  background-color: ${colors.V900};
  padding: 1rem;
`;

const Field = ({ label, value }) => {
  return (
    <FieldWrapper>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </FieldWrapper>
  );
};

const StakeConfirmModal = ({
  isStakeConfirmModalOpen,
  setStakeConfirmModalOpen,
  onStakeConfirmed,
  cennzStakingBalance,
  gasFee,
  stakingAccount,
  isStakingEnabled,
}) => {
  return (
    <Modal isOpen={isStakeConfirmModalOpen}>
      <ModalBody>
        <PageHeading subHeading="Once confirm, your staking order will be seated in the pool, and be executed in the beginning of next Era.">
          Confirm staking summary
        </PageHeading>
        <Grid rows={2} columns={2}>
          <Cell width={1}>
            <Field
              label="Stake"
              value={`${cennzStakingBalance} ${
                PreDefinedAssetIdName[PreDefinedAssetId.stakingToken]
              }`}
            />
          </Cell>
          <Cell width={1}>
            <Field
              label="Transaction fee"
              value={`${gasFee} ${PreDefinedAssetIdName[PreDefinedAssetId.spendingToken]}`}
            />
          </Cell>
          <Cell width={2}>
            <Field
              label="Staking account address"
              value={`${stakingAccount && stakingAccount.address}`}
            />
          </Cell>
        </Grid>
      </ModalBody>
      <ModalFooter>
        <div style={{ display: 'flex' }}>
          <Button
            onClick={() => setStakeConfirmModalOpen(false)}
            style={{ marginRight: '0.5rem' }}
            color="nuetral"
            flat
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onStakeConfirmed();
              setStakeConfirmModalOpen(false);
            }}
            disabled={!isStakingEnabled}
          >
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default StakeConfirmModal;
