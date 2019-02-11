import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import NameInput from 'renderer/pages/wallet/NameInput';

const NameInputPage = ({
  existingWallets,
  onCreateWallet,
  walletName,
  setWalletName,
  mnemonic,
}) => {
  return (
    <React.Fragment>
      <PageHeading>Name your connected wallet</PageHeading>
      <NameInput
        existingWallets={existingWallets}
        onSubmit={value => {
          console.log('onSubmitValue', value);
          onCreateWallet({
            name: walletName,
            mnemonic,
            passphrase: '', // TODO: Grab value from users input
          });
        }}
      />
    </React.Fragment>
  );
};

export default NameInputPage;
