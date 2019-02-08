import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import NameInput from 'renderer/pages/wallet/NameInput';

const NameInputPage = ({
  existingWallets,
  setWalletName,
  walletName,
  setIsOpenPenPrepareModal,
  ...otherProps
}) => {
  return (
    <React.Fragment>
      <PageHeading>Name your connected wallet</PageHeading>
      <NameInput
        existingWallets={existingWallets}
        onSubmit={value => {
          console.log('onSubmitValue', value);
          setWalletName(value);
        }}
      />
    </React.Fragment>
  );
};

export default NameInputPage;
