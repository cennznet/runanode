import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import NameInput from 'renderer/pages/wallet/NameInput';
import { WALLETTYPE } from './constants';

const NameInputPage = ({
  existingWallets,
  onCreateSKRWallet,
  walletName,
  setWalletName,
  mnemonic,
  recoverWalletType,
  onCreateHDKRWallet,
}) => {
  return (
    <React.Fragment>
      <PageHeading>Name your connected wallet</PageHeading>
      <NameInput
        existingWallets={existingWallets}
        onSubmit={value => {
          recoverWalletType === WALLETTYPE.HDWALLET
            ? onCreateHDKRWallet({
                name: value,
                mnemonic,
                passphrase: '', // TODO: Grab value from users input
              })
            : onCreateSKRWallet({
                name: value,
                mnemonic,
                passphrase: '', // TODO: Grab value from users input
              });
        }}
      />
    </React.Fragment>
  );
};

export default NameInputPage;
