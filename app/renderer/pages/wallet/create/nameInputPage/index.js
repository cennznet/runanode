import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import NameInput from 'renderer/pages/wallet/NameInput';
import GetReadyWarningModal from './GetReadyWarningModal';

const NameInputPage = ({
  existingWallets,
  setWalletName,
  walletName,
  setIsOpenPenPrepareModal,
  ...otherProps
}) => {
  return (
    <React.Fragment>
      <PageHeading>Name your wallet</PageHeading>
      <NameInput
        existingWallets={existingWallets}
        onSubmit={value => {
          setWalletName(value);
          setIsOpenPenPrepareModal(true);
        }}
      />
      <GetReadyWarningModal
        walletName={walletName}
        setIsOpenPenPrepareModal={setIsOpenPenPrepareModal}
        {...otherProps}
      />
    </React.Fragment>
  );
};

export default NameInputPage;
