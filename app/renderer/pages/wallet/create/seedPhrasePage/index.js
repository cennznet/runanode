import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { STEPS } from '../constants';
import SeedPhraseList from './SeedPhraseList';
import StoreSeedPhraseModal from './StoreWarningModal';

const ButtonPanelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -6rem;
  padding: 1rem;
  height: 1rem;
  flex: 1 1 auto;
`;

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
      <ButtonPanelContainer>
        <Button onClick={() => console.log('click')}>12 Words</Button>
        <Button onClick={() => console.log('click')}>English</Button>
        <Button color="secondary" onClick={() => window.odin.api.cennz.generatePaperWallet({'mnemonic': mnemonicString})}>
          Download
          <FontAwesomeIcon icon="download" />
        </Button>
      </ButtonPanelContainer>
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
