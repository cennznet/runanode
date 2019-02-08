import React from 'react';
import { Button, PageHeading, PageFooter, Form } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Field } from 'formik';
import { STEPS } from '../constants';

const SeedPhraseExplain = styled.div`
  display: flex;
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
      <Formik
        initialValues={{}}
        onSubmit={value => console.log(value)}
        render={({ handleSubmit, ...formProps }) => {
          const { isValid } = formProps;
          return (
            <Form onSubmit={handleSubmit}>
              <div>
                <SeedPhraseExplain>
                  <div>Enter your recovery seed phrase</div>
                  <FontAwesomeIcon style={{ marginLeft: '0.5rem' }} icon="question-circle" />
                </SeedPhraseExplain>
              </div>
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
