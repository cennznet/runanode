import React from 'react';
import { Button, PageHeading, PageFooter, Input, Modal } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STEPS } from '../constants';
import PrepareWarningModal from './prepareWarningModal';

const InputTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const NameInputPage = ({ setWalletName, walletName, setIsOpenPenPrepareModal, ...otherProps }) => {
  return (
    <React.Fragment>
      <div>
        <PageHeading subHeading="">Name your wallet</PageHeading>
        <InputTitle>Wallet name</InputTitle>
        <Input
          backgroundColor={colors.V400}
          borderColor="transparent"
          color={colors.N0}
          height="3rem"
          onChange={e => setWalletName(e.target.value)}
        />
      </div>
      <PageFooter>
        <StartOverLink />
        <Button disabled={!walletName} onClick={() => setIsOpenPenPrepareModal(true)}>
          Next
        </Button>
      </PageFooter>
      <PrepareWarningModal setIsOpenPenPrepareModal={setIsOpenPenPrepareModal} {...otherProps} />
    </React.Fragment>
  );
};

export default NameInputPage;
