import React from 'react';
import { Button, PageHeading, PageFooter, Form } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import WordField from 'renderer/pages/wallet/WordField';
import { seedPhraseFields } from './utils';
import { STEPS, WALLETTYPE } from '../constants';

const SeedPhraseExplain = styled.div`
  display: flex;
`;

const ChooseRecoverType = styled.div`
  display: flex;
  margin: 1rem auto;
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
        <ChooseRecoverType>
          <Button flat onClick={() => console.log('HDKeyring')}>
            HDKeyring
          </Button>
          <Button onClick={() => console.log('SimpleKeyring')}>SimpleKeyring</Button>
        </ChooseRecoverType>
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
                <Button type="submit" color="primary">
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
// disabled={!isValid}
// : 'stone,more,endorse,silent,pluck,insect,obtain,chalk,grid,pass,season,truck',
