import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import { STEPS } from '../constants';
import SeedPhraseList from './SeedPhraseList';
import StoreSeedPhraseModal from './StoreWarningModal';

const SeedPhrasePage = props => {
  const {
    mnemonicString,
    onCreateWallet,
    isStoreWarningModalOpen,
    setStoreWarningModalOpen,
  } = props;
  return (
    <React.Fragment>
      <PageHeading subHeading="It is essential that you write this down and store it somewhere securely, like a safe or safety deposit box. If you lose access to your wallet, this seed phrase is the only way to recover your funds. Your seed phrase will only display once.">
        Store your seed phrase offline
      </PageHeading>
      <div className="content">
        <SeedPhraseList {...{ mnemonicString }} />
      </div>
      <PageFooter>
        <StartOverLink />
        <Button onClick={() => setStoreWarningModalOpen(true)}>Next</Button>
      </PageFooter>
      <StoreSeedPhraseModal {...props} />
    </React.Fragment>
  );
};

export default SeedPhrasePage;
