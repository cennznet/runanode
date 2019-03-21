import React from 'react';
import { Button, PageHeading, PageFooter, Form, Radio, Hint } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import WordField from 'renderer/pages/wallet/WordField';
import { colors } from 'renderer/theme';
import MNEMONIC_RULE from 'renderer/constants/mnemonic';
import { WALLET_TYPE } from 'renderer/constants/wallet';
import { recoverySeedPhrases } from './utils';
import { STEPS } from '../constants';

const ReocveryOptionWrapper = styled.div`
  flex-direction: column;
  padding: 1.5rem auto;
  border-bottom: 0.8px solid rgba(255, 255, 255, 0.3);
`;

const ReocveryOptionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const ReocveryOptionExplain = styled.div`
  margin: 0.5rem auto;
  color: ${colors.textMuted};
`;

const RadioGroup = styled.div`
  display: flex;
  margin: 2rem auto;

  label {
    width: 50%;
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
  const onSubmitAction = async mnemonicInput => {
    const mnemonic = Object.values(mnemonicInput).join(MNEMONIC_RULE);
    setMnemonic(mnemonic);
    let checkedWallet = null;

    if (recoverWalletType === WALLET_TYPE.HD) {
      checkedWallet = await onValidateHDKRWallet(mnemonic);
    } else {
      checkedWallet = await onValidateSKRWallet(mnemonic);
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
          <ReocveryOptionTitle>
            Choose the type of the wallet you want to connect to
          </ReocveryOptionTitle>
          <RadioGroup>
            <Radio
              selected={recoverWalletType}
              value={WALLET_TYPE.HD}
              onChange={() => setRecoverWalletType(WALLET_TYPE.HD)}
            >
              <div>HD Wallet</div>
              <ReocveryOptionExplain>
                You can generate multiple public address in HD wallet. Choose this one if you
                created it on CENNZNode
              </ReocveryOptionExplain>
            </Radio>
            <Radio
              selected={recoverWalletType}
              value={WALLET_TYPE.SIMPLE}
              onChange={() => setRecoverWalletType(WALLET_TYPE.SIMPLE)}
            >
              <div> Simple Wallet</div>
              <ReocveryOptionExplain>
                This wallet only has one address, and can not generate more.
              </ReocveryOptionExplain>
            </Radio>
          </RadioGroup>
        </ReocveryOptionWrapper>
        <SeedPhraseExplain>
          <div>Enter your recovery seed phrase</div>
          <Hint tooltip={{ styles: { maxWidth: '25rem' } }}>
            <React.Fragment>
              <p>
                The seed phrase is a set of words that allows you get access to funds of your
                wallet. When you registering an account, you will be always asked to save your
                secret seed phrase which contains 12 or more English words with spaces between each
                word.
              </p>
            </React.Fragment>
          </Hint>
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
                {recoverySeedPhrases.map(seedPhrase => (
                  <Field
                    key={seedPhrase.name}
                    name={seedPhrase.name}
                    labelText={seedPhrase.index}
                    placeholder="Enter word"
                    validate={values => !values && 'The field can not be null'}
                    component={WordField}
                    noTickShow
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
