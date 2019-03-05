import React, { useState } from 'react';
import styled from 'styled-components';

import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import withContainer from './container';
import { CENNZScanAddressUrl } from '../../../common/types/cennznet-node.types';
import ClipboardShareLinks from '../wallet/account/transferSectionPage/ClipboardShareLinks';
import UnStakeWarningModal from './UnStakeWarningModal';
import CennznetWallet from '../../api/wallets/CennznetWallet';
import CennznetWalletAccount from '../../api/wallets/CennznetWalletAccount';
import ChangeStakingPreferenceModal from './ChangeStakingPreferenceModal';

const UnStakeButton = styled(Button)`
  position: absolute;
  right: 0rem;
`;


const ChangePreferenceButton = styled(Button)`
`;

const Subheading = ({ account, wallet }) => {
  const url = CENNZScanAddressUrl.rimu; // TODO should base on selected network
  const { name: walletName } = wallet;
  const { name: accountName } = account;
  return (
    <div style={{ display: 'flex' }}>
      <span>Staking account:{walletName || 'N/A'}:{accountName || 'N/A'}:</span>
      <ClipboardShareLinks
        url={url}
        styles={{
          height: '1rem',
          lineHeight: '1rem',
          padding: null,
          backgroundColor: null,
          textDecoration: null,
          icon2MarginLeft: '1rem',
          textPaddingTop: null,
          textMinWidth: null,
        }}>
        {account.address}
      </ClipboardShareLinks>
    </div>
  );
};

const StakingStakePage = ({ subNav, onUnStake, onSaveStakingPreferences }) => {
  // TODO fetch from saved stake account value
  const stakingWallet: CennznetWallet = window.odin.store.getState().localStorage.WALLETS[0];
  const stakingAccount: CennznetWalletAccount = window.odin.store.getState().localStorage.WALLETS[0].accounts['5FrNwaJ62UmCo2WdxxhyUHu9AkuAdmZUs3rduTKALsFsrWFv'];
  const [isUnStakeWarningModalOpen, setUnStakeWarningModalOpen] = useState(false);
  const [isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen] = useState(false);

  return (
    <MainLayout subNav={subNav}>
      <MainContent>
        <UnStakeButton color="danger" onClick={() => setUnStakeWarningModalOpen(true)}>Unstake</UnStakeButton>
        <PageHeading
          subHeading={<Subheading {...{ account: stakingAccount, wallet: stakingWallet }} />}>
          Manage
        </PageHeading>
        <div className="content">
          content
          <ChangePreferenceButton onClick={() => setChangeStakingPreferenceModalOpen(true)}>Change preference</ChangePreferenceButton>
        </div>
      </MainContent>
      <UnStakeWarningModal {...{isUnStakeWarningModalOpen, setUnStakeWarningModalOpen, onUnStake, stakingWallet, stakingAccount}}/>
      <ChangeStakingPreferenceModal {...{isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen, stakingWallet, stakingAccount, onSaveStakingPreferences }} />
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
