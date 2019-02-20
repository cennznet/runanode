import React from 'react';
import { Button, PageHeading, Modal, Input, Form } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NameInput from 'renderer/pages/wallet/NameInput';
import { Formik, Field } from 'formik';
import { lensProp, set, lensPath } from 'ramda';

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
  newAccountName,
  newAccount,
  reslovedWallet,
  onConfirmAddAccount,
}) => {
  if (!newAccount || !reslovedWallet) {
    return null;
  }

  const { name: walletName, accounts } = reslovedWallet;
  const existingAccountAmount = Object.keys(accounts).length;
  const defaultNewAccountName = `Account ${existingAccountAmount}`;
  const existingAccountNames = existingAccountAmount
    ? Object.keys(accounts).map(account => accounts[account].name && accounts[account].name)
    : [];

  const fieldName = 'newAccountName';
  const onAddAccountClick = name => {
    const updatedAccounts = set(lensProp('name'), name, accounts[newAccount]);
    const updatedWallet = reslovedWallet;
    updatedWallet.accounts[newAccount] = updatedAccounts;
    onConfirmAddAccount(updatedWallet);
    setAddAccountModalOpen(false);
  };

  return (
    <Formik
      initialValues={{ newAccountName: defaultNewAccountName }}
      onSubmit={{}}
      render={formProps => {
        const { isValid, values, errors, touched } = formProps;

        return (
          <Form onSubmit={formProps.handleSubmit}>
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
                    <Modal
                      isOpen={isAddAccountModalOpen}
                      footer={
                        <ButtonGroup>
                          <Button
                            flat
                            color="nuetral"
                            onClick={() => {
                              errors[field.name] = '';
                              setAddAccountModalOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => onAddAccountClick(values[fieldName])}
                            style={{ marginLeft: '0.5rem' }}
                            color="warning"
                          >
                            Add
                          </Button>
                        </ButtonGroup>
                      }
                    >
                      <PageHeading>Add an account to {walletName}</PageHeading>
                      <InputTitle>Account Name</InputTitle>
                      <ModalWarningWrapper>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Please enter account name..."
                          value={values[field.name] || ''}
                          valid={touched[field.name] && !errors[field.name]}
                        />
                        {errors[field.name] && <ErrorField>{errors[field.name]}</ErrorField>}
                      </ModalWarningWrapper>
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
