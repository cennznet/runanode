import React from 'react';
import { Button, PageHeading, PageFooter, Input } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { STEPS } from './constants';

const InputTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const NameInputPage = ({ step, moveToStep, setMnemonicString, walletName, setWalletName }) => {
  return (
    <React.Fragment>
      <div>
        <PageHeading subHeading="">Name your wallet</PageHeading>
        <InputTitle>Wallet name</InputTitle>
        <Input
          backgroundColor="rgba(114,94,255,0.5)"
          borderColor="transparent"
          color={colors.N0}
          height="3rem"
          onChange={e => setWalletName(e.target.value)}
        />
      </div>
      <PageFooter>
        <StartOverLink />
        <Button
          disabled={!walletName}
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
