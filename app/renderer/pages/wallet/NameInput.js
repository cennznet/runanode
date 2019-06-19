import React from 'react';
import { Form, Button, PageFooter, Input } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import themeObject, { colors } from 'theme';
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
  margin: 1rem auto;
`;

const NameInput = ({ existingWallets, onSubmit: onSubmitFunc }) => {
  const fieldName = 'walletName';
  const existingWalletNames = existingWallets ? existingWallets.map(wallet => wallet.name) : [];
  return (
    <Formik
      initialValues={{}}
      onSubmit={value => onSubmitFunc(value[fieldName])}
      render={formProps => {
        const { isValid, values, errors, touched } = formProps;

        return (
          <Form onSubmit={formProps.handleSubmit}>
            <Field
              type="text"
              name={fieldName}
              validate={value => {
                if (!value) {
                  return 'Please enter wallet name.';
                }
                if (existingWalletNames.includes(value)) {
                  return 'This name has been taken.';
                }
                return '';
              }}
              render={({ field }) => {
                return (
                  <div>
                    <InputTitle>Wallet Name</InputTitle>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Please enter wallet name..."
                      value={values[field.name] || ''}
                      valid={touched[field.name] && !errors[field.name]}
                    />
                    {errors[field.name] && <ErrorField>{errors[field.name]}</ErrorField>}
                  </div>
                );
              }}
            />
            <PageFooter>
              <StartOverLink />
              <Button type="submit" disabled={!formProps.isValid}>
                Next
              </Button>
            </PageFooter>
          </Form>
        );
      }}
    />
  );
};

export default NameInput;
