import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import withContainer from './container';
import NameInputPage from './nameInputPage';
import SeedPhrasePage from './seedPhrasePage';
import SeedPhraseQuizPage from './seedPhraseQuizPage';
import { STEPS } from './constants';

const WalletCreatePage = props => {
  const { step, moveToStep } = props;
  return (
    // <MainLayout withoutSidebar>
    <MainLayout>
      <MainContent display="flex">
        {step === STEPS.NAME_INPUT && (
          <NameInputPage
            {...props}
            onClick={() => {
              moveToStep(STEPS.SEED_PHRASE);
            }}
          />
        )}
        {step === STEPS.SEED_PHRASE && (
          <SeedPhrasePage
            {...props}
            onClick={() => {
              moveToStep(STEPS.SEED_PHRASE_QUIZ);
            }}
          />
        )}
        {step === STEPS.SEED_PHRASE_QUIZ && <SeedPhraseQuizPage {...props} />}
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletCreatePage);
