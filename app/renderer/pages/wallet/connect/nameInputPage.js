import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import NameInput from 'renderer/pages/wallet/NameInput';
import { WALLET_TYPE } from 'renderer/constants/wallet';

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
          recoverWalletType === WALLET_TYPE.HD
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
