import React from 'react';
import { Button, PageHeading, PageFooter, Form } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import WordField from 'renderer/pages/wallet/WordField';
import { seedPhraseFields } from './utils';

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

const seedPhraseRecoverPage = props => {
  const {
    mnemonicString,
    walletName,
    onCreateWallet,
    isStoreWarningModalOpen,
    setStoreWarningModalOpen,
    nodeSystem,
    setSeedPhaseDownloadModalOpen,
  } = props;
  return (
    <React.Fragment>
      <PageHeading>Connect your existing wallet</PageHeading>
      <div>
        <SeedPhraseExplain>
          <div>Enter your recovery seed phrase</div>
          <FontAwesomeIcon style={{ marginLeft: '0.5rem' }} icon="question-circle" />
        </SeedPhraseExplain>
        <ChooseRecoverType>
          <Button onClick={() => console.log('HDKeyring')}>HDKeyring</Button>
          <Button onClick={() => console.log('SimpleKeyring')}>SimpleKeyring</Button>
        </ChooseRecoverType>
      </div>
      <Formik
        initialValues={{}}
        onSubmit={value => console.log(value)}
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
