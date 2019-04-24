import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SeedPhraseList from './SeedPhraseList';
import StoreSeedPhraseModal from './StoreWarningModal';
import SeedPhraseDownloadModal from './SeedPhraseDownloadModal';

const ButtonPanelContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
`;

const SeedPhrasePage = props => {
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
      <PageHeading subHeading="It is essential that you write this down and store it somewhere securely, like a safe or safety deposit box. If you lose access to your wallet, this seed phrase is the only way to recover your funds. Your seed phrase will only display once.">
        Store your seed phrase offline
      </PageHeading>
      <ButtonPanelContainer>
        <Button
          variant="secondary"
          onClick={() => {
            setSeedPhaseDownloadModalOpen(true);
          }}
        >
          Download
          <FontAwesomeIcon style={{ marginLeft: '0.5rem' }} icon="download" />
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
      <SeedPhraseDownloadModal {...props} />
    </React.Fragment>
  );
};

export default SeedPhrasePage;
