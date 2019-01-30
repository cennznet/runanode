import React from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { Button, Form, Input, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import ROUTES from 'renderer/constants/routes';
import WordField from './WordField';

import { getQuizList } from './utils';

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SeedPhraseQuizPage = props => {
  const { onCreateWallet, walletName, mnemonicString } = props;
  const quizList = getQuizList(mnemonicString);

  const onSubmit = (values, actions) => {
    onCreateWallet({
      name: walletName,
      mnemonic: mnemonicString,
      passphrase: '', // TODO: Grab value from users input
    });
  };

  return (
    <React.Fragment>
      <PageHeading subHeading="Your seed is important! If you lose your seed you will have no way to recover your wallet. To make sure you have properly saved your seed, please retype words">
        Confirm seed phrase
      </PageHeading>
      <Formik
        initialValues={{}}
        {...{ onSubmit }}
        render={({ handleSubmit, ...formProps }) => {
          const { isValid } = formProps;
          return (
            <Form onSubmit={handleSubmit}>
              <div className="content">
                <InputGroup>
                  {quizList.map(quiz => {
                    return (
                      <Field
                        key={quiz.name}
                        name={quiz.name}
                        labelText={quiz.index}
                        placeholder="Enter word"
                        validate={values => (values === quiz.word ? '' : `${values}/${quiz.word}`)}
                        component={WordField}
                      />
                    );
                  })}
                </InputGroup>
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

export default SeedPhraseQuizPage;
