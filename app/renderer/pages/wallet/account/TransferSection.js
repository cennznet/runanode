import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import styled from 'styled-components';
import BN from 'bn.js';
import * as Yup from 'yup';

import {Button, Form, PageHeading, PageFooter, Select} from 'components';
import StartOverLink from '../StartOverLink';
import SelectField from '../SelectField';
import TextField from '../TextField';
import { PreDefinedAssetId, PreDefinedAssetIdName } from '../../../../common/types/cennznet-node.types';


const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TransferSection = ({ account, onTransfer, currentWallet }) => {
  const onSubmit = (values, actions) => {
    const payload = {
      ...values,
      wallet: currentWallet,
      fromAddress: account.address,
      assetId: values.assetId.value,
    };
    onTransfer(payload);
    actions.resetForm();
  };

  const ValidateSchema = Yup.object().shape({
    assetId: Yup.object()
      .required('Required'),
    amount: Yup.string()
      .matches(/^[0-9]*$/, 'Amount should a number')
      .when('assetId', (assetId, passSchema) => {
        return passSchema.test('test-name', 'Amount greater than account balance',
          (value) => {
            const freeBalance = new BN(account.assets[assetId.value].freeBalance.toString, 10);
            return new BN(value, 10).lte(freeBalance);
          });
      })
      .required('Required'),
    toAddress: Yup.string()
      .min(48, 'Invalid address, length must be 48')
      .max(48, 'Invalid address, length must be 48')
      .test('test-name', 'Can\'t send to your own address',
        (value) => {
          return account.address !== value;
        })
      .required('Required'),
  });

  return (
    <React.Fragment>
      <Formik
        validationSchema={ValidateSchema}
        initialValues={{
          assetId: { label: PreDefinedAssetIdName[PreDefinedAssetId.stakingToken], value: 0 }
        }}
        {...{ onSubmit }}
        render={({ handleSubmit, ...formProps }) => {
          const { isValid } = formProps;
          return (
            <Form onSubmit={handleSubmit} style={{height: 'calc(100vh - 290px)'}}>
              <div className="content">
                <InputGroup>
                  <Field
                    key="assetId"
                    name="assetId"
                    labelText="Asset"
                    width='45%'
                    options={[
                      { label: PreDefinedAssetIdName[PreDefinedAssetId.stakingToken], value: 0 },
                      { label: PreDefinedAssetIdName[PreDefinedAssetId.spendingToken], value: 10 }]}
                    component={SelectField}
                  />
                  <Field
                    key="amount"
                    name="amount"
                    labelText="Amount"
                    placeholder=""
                    width='45%'
                    component={TextField}
                  />
                </InputGroup>
                <InputGroup>
                  <Field
                    key="toAddress"
                    name="toAddress"
                    labelText="Recipient Address"
                    placeholder=""
                    width='100%'
                    component={TextField}
                  />
                </InputGroup>
              </div>
              <PageFooter>
                <div />
                <Button type="submit" color="primary" disabled={!isValid}>
                  Make Payment
                </Button>
              </PageFooter>
            </Form>
          );
        }}
      />
    </React.Fragment>
  );
};

export default TransferSection;

