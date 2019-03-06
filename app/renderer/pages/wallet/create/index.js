import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import withContainer from './container';
import NameInputPage from './nameInputPage';
import SeedPhrasePage from './seedPhrasePage';
import SeedPhraseConfirmPage from './seedPhraseConfirmPage';
import { STEPS } from './constants';

const WalletCreatePage = props => {
  const { step, moveToStep, setMnemonicString } = props;
  return (
    // <MainLayout withoutSidebar>
    <MainLayout>
      <MainContent display="flex">
        {step === STEPS.NAME_INPUT && <NameInputPage {...props} />}
        {step === STEPS.SEED_PHRASE && <SeedPhrasePage {...props} />}
        {step === STEPS.SEED_PHRASE_CONFIRM && <SeedPhraseConfirmPage {...props} />}
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletCreatePage);
