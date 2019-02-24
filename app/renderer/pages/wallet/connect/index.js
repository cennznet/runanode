import React from 'react';
import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import withContainer from './container';
import NameInputPage from './nameInputPage';
import SeedPhraseRecoverPage from './seedPhraseRecoverPage';
import { STEPS } from './constants';

const WalletConnectPage = props => {
  const { step, moveToStep, setMnemonicString } = props;
  return (
    // <MainLayout withoutSidebar>
    <MainLayout>
      <MainContent display="flex">
        {step === STEPS.SEED_PHRASE_RECOVER && <SeedPhraseRecoverPage {...props} />}
        {step === STEPS.NAME_INPUT && <NameInputPage {...props} />}
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(WalletConnectPage);
