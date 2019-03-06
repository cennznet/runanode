import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody } from 'components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import BN from 'bn.js';
import * as Yup from 'yup';
import R from 'ramda';

import Form from 'components/Form';
import TextField from 'components/Field/TextField';

const ButtonGroup = styled.div`
  display: flex;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChangeStakingPreferenceModal = ({ isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen, stakingWallet, stakingAccount, onSaveStakingPreferences }) => {
  const initialValues = {
    unStakeThreshold: '3',
    paymentPreferences: '0',
  };

  const onSubmit = (values, actions) => {
    setChangeStakingPreferenceModalOpen(false);
    const payload = {
      wallet: stakingWallet,
      address: stakingAccount.address,
      unStakeThreshold: parseInt(values.unStakeThreshold, 10),
      paymentPreferences: parseInt(values.paymentPreferences, 10),
    }
    onSaveStakingPreferences(payload);
    // TODO unable to reset form
    // actions.resetForm();
  };

  const ValidateSchema = Yup.object().shape({
    unStakeThreshold: Yup.string()
      .matches(/^[0-9]*$/, 'value should a number')
      .required('Required'),
    paymentPreferences: Yup.string()
      .matches(/^[0-9]*$/, 'value should a number')
      .required('Required'),
  });

  return (
    <React.Fragment>
      <Formik
        validationSchema={ValidateSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({handleSubmit, ...formProps}) => {
          const { isValid, values, errors, touched } = formProps;
          return (
            <Form
              onSubmit={handleSubmit}
              style={{ display: 'none' }} // without this will change the manage page layout
            >
              <div>
                <Modal isOpen={isChangeStakingPreferenceModalOpen}>
                  <ModalBody>
                    <PageHeading>Change staking preference</PageHeading>
                    <InputGroup>
                      <Field
                        key="unStakeThreshold"
                        name="unStakeThreshold"
                        labelText="Unstake threshold"
                        width='45%'
                        component={TextField}
                        append="times of warning"
                        placeholder=""
                      />
                      <Field
                        key="paymentPreferences"
                        name="paymentPreferences"
                        labelText="Validator Payment"
                        width='45%'
                        component={TextField}
                        append="CENNZ"
                      />
                    </InputGroup>
                  </ModalBody>
                  <ModalFooter>
                    <ButtonGroup>
                      <Button
                        flat
                        color="nuetral"
                        onClick={() => {
                          setChangeStakingPreferenceModalOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        style={{ marginLeft: '0.5rem' }}
                        disabled={!R.isEmpty(errors)}
                        onClick={() => {
                          onSubmit(values, null);
                        }}
                      >
                        Confirm
                      </Button>
                    </ButtonGroup>
                  </ModalFooter>
                </Modal>
              </div>
            </Form>
          );
        }}
      />
    </React.Fragment>
  );
};

export default ChangeStakingPreferenceModal;
