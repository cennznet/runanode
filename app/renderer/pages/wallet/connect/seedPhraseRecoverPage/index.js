import React from 'react';
import { Button, PageHeading, PageFooter, Form, Radio } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import WordField from 'renderer/pages/wallet/WordField';
import { seedPhraseFields } from './utils';
import { STEPS, WALLETTYPE } from '../constants';

const ReocveryOptionWrapper = styled.div`
  flex-direction: column;
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`;

const ReocveryOptionExplain = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const RadioGroup = styled.div`
  display: flex;
  margin: 1rem auto;

  label {
    margin-right: 1rem;
  }
`;

const SeedPhraseExplain = styled.div`
  display: flex;
  margin: 2rem auto 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const seedPhraseRecoverPage = ({
  onValidateSKRWallet,
  setMnemonic,
  moveToStep,
  recoverWalletType,
  setRecoverWalletType,
  onValidateHDKRWallet,
}) => {
  const onSubmitAction = async values => {
    const mnemonic = Object.values(values).join();
    setMnemonic(mnemonic);

    let checkedWallet = null;
    if (recoverWalletType === WALLETTYPE.HDWALLET) {
      checkedWallet = await onValidateHDKRWallet({ mnemonic });
    } else {
      checkedWallet = await onValidateSKRWallet({ mnemonic });
    }
    const { wallet } = checkedWallet;
    if (wallet) {
      moveToStep(STEPS.NAME_INPUT);
    }
  };
  return (
    <React.Fragment>
      <PageHeading>Connect your existing wallet</PageHeading>
      <div>
        <ReocveryOptionWrapper>
          <ReocveryOptionExplain>
            Choose the type of the wallet you want to connect to{' '}
          </ReocveryOptionExplain>
          <RadioGroup>
            <Radio
              selected={recoverWalletType}
              value={WALLETTYPE.HDWALLET}
              onChange={() => setRecoverWalletType(WALLETTYPE.HDWALLET)}
            >
              HD Wallet
            </Radio>
            <Radio
              selected={recoverWalletType}
              value={WALLETTYPE.SIMPLEWALLET}
              onChange={() => setRecoverWalletType(WALLETTYPE.SIMPLEWALLET)}
            >
              Simple Wallet
            </Radio>
          </RadioGroup>
        </ReocveryOptionWrapper>
        <SeedPhraseExplain>
          <div>Enter your recovery seed phrase</div>
          <FontAwesomeIcon style={{ marginLeft: '0.5rem' }} icon="question-circle" />
        </SeedPhraseExplain>
      </div>
      <Formik
        initialValues={{}}
        onSubmit={values => onSubmitAction(values)}
        render={({ handleSubmit, ...formProps }) => {
          const { isValid } = formProps;
          return (
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                {seedPhraseFields.map(seedPhraseField => (
                  <Field
                    key={seedPhraseField.name}
                    name={seedPhraseField.name}
                    labelText={seedPhraseField.index}
                    placeholder="Enter word"
                    validate={values => !values && 'The field can not be null'}
                    component={WordField}
                  />
                ))}
              </InputGroup>
              <PageFooter>
                <StartOverLink />
                <Button type="submit" color="primary" disabled={!isValid}>
                  Next
                </Button>
              </PageFooter>
            </Form>
          );
        }}
      />
    </React.Fragment>
  );
};

export default seedPhraseRecoverPage;
