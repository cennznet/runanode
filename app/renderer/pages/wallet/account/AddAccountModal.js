import React from 'react';
import { Button, PageHeading, Modal, ModalFooter, ModalBody, Input, Form } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NameInput from 'renderer/pages/wallet/NameInput';
import { Formik, Field } from 'formik';

const InputTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const IntputWrapper = styled.div`
  height: 100%;
`;

const ErrorField = styled.div`
  color: ${colors.R400};
  margin: 1rem 0;
`;

const ModalWarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalWarningDetails = styled.div`
  margin-left: 0.5rem;
  line-height: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const AddAccountModal = ({
  isAddAccountModalOpen,
  setAddAccountModalOpen,
  toUpdateWallet,
  onConfirmAddAccount,
}) => {
  if (!toUpdateWallet) {
    return null;
  }

  const { name: walletName, accounts } = toUpdateWallet;
  const numOfExistingAccounts = Object.keys(accounts) && Object.keys(accounts).length;
  const defaultNewAccountName = `Account ${numOfExistingAccounts + 1}`;
  const existingAccountNames = numOfExistingAccounts
    ? Object.keys(accounts).map(account => accounts[account].name && accounts[account].name)
    : [];

  const fieldName = 'newAccountName';
  const onAddAccountClick = newAccountName => {
    onConfirmAddAccount({ newAccountName, toUpdateWallet });
    setAddAccountModalOpen(false);
  };

  return (
    <Formik
      initialValues={{ newAccountName: defaultNewAccountName }}
      render={formProps => {
        const { isValid, values, errors, touched } = formProps;

        return (
          <Form>
            <Field
              type="text"
              name={fieldName}
              validate={value => {
                if (!value) {
                  return 'Please enter account name.';
                }
                if (existingAccountNames.includes(value)) {
                  return 'This name has been taken.';
                }
                return '';
              }}
              render={({ field }) => {
                return (
                  <div>
                    <Modal isOpen={isAddAccountModalOpen}>
                      <ModalBody>
                        <PageHeading>Add an account to {walletName}</PageHeading>
                        <InputTitle>Account Name</InputTitle>
                        <ModalWarningWrapper>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Please enter account name..."
                            value={values[field.name]}
                            valid={touched[field.name] && !errors[field.name]}
                          />
                          {errors[field.name] && <ErrorField>{errors[field.name]}</ErrorField>}
                        </ModalWarningWrapper>
                      </ModalBody>
                      <ModalFooter>
                        <ButtonGroup>
                          <Button
                            flat
                            onClick={() => {
                              setAddAccountModalOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => onAddAccountClick(values[fieldName])}
                            style={{ marginLeft: '0.5rem' }}
                            disabled={!values[fieldName]}
                          >
                            Add
                          </Button>
                        </ButtonGroup>
                      </ModalFooter>
                    </Modal>
                  </div>
                );
              }}
            />
          </Form>
        );
      }}
    />
  );
};

export default AddAccountModal;
