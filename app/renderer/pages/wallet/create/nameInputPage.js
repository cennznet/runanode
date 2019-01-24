import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import { STEPS } from './constants';

const NameInputPage = ({ step, moveToStep, setMnemonicString }) => {
  return (
    <React.Fragment>
      <PageHeading subHeading="">Name your wallet</PageHeading>
      <div className="content">Wallet name input</div>
      <PageFooter>
        <StartOverLink />
        <Button
          onClick={() => {
            const mnemonic = window.odin.api.cennz.createMnemonic({ num: 12 });
            setMnemonicString(mnemonic);
            moveToStep(STEPS.SEED_PHRASE);
          }}
        >
          Next
        </Button>
      </PageFooter>
    </React.Fragment>
  );
};

export default NameInputPage;
