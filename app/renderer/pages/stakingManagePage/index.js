import React, { useState } from 'react';
import styled from 'styled-components';

import { colors } from 'renderer/theme';
import { Logger } from 'renderer/utils/logging';
import { MainContent, MainLayout } from 'components/layout';
import { Button, PageHeading } from 'components';
import withContainer from './container';
import { CENNZScanAddressUrl } from '../../../common/types/cennznet-node.types';
import ClipboardShareLinks from '../wallet/account/transferSectionPage/ClipboardShareLinks';
import UnStakeWarningModal from './UnStakeWarningModal';
import CennznetWallet from '../../api/wallets/CennznetWallet';
import CennznetWalletAccount from '../../api/wallets/CennznetWalletAccount';
import ChangeStakingPreferenceModal from './ChangeStakingPreferenceModal';
import useApis from '../stakingOverviewPage/useApis';

const UnStakeButton = styled(Button)`
  position: absolute;
  right: 0rem;
`;

const ChangePreferenceButton = styled(Button)`
`;

const StakingPreferenceWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: ${colors.V900};
  border-radius: 3px;
  padding: 2rem 2rem 2rem 1rem;
`;

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: 600;
  width: 100%
`;

const Left = styled.div`
`;

const Right = styled.div`
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

const StakingStakePage = ({ subNav, onUnStake, onSaveStakingPreferences, staking }) => {

  // TODO fetch from saved stake account value
  const stakingWallet: CennznetWallet = window.odin.store.getState().localStorage.WALLETS[0];
  const stakingAccountAddress = Object.keys(window.odin.store.getState().localStorage.WALLETS[0].accounts)[0];
  const stakingAccount: CennznetWalletAccount = window.odin.store.getState().localStorage.WALLETS[0].accounts[stakingAccountAddress];

  const [intentions] = useApis(
    'getIntentions'
  );

  const intentionsIndex = intentions ? intentions.indexOf(stakingAccount.address) : -1;
  Logger.debug(`StakingStakePage, intentionsIndex: ${intentionsIndex}`);
  const [isUnStakeWarningModalOpen, setUnStakeWarningModalOpen] = useState(false);
  const [isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen] = useState(false);

  return (
    <MainLayout subNav={subNav}>
      <MainContent display="flex">
        <UnStakeButton color="danger" onClick={() => setUnStakeWarningModalOpen(true)}>Unstake</UnStakeButton>
        <PageHeading
          subHeading={<Subheading {...{ account: stakingAccount, wallet: stakingWallet }} />}>
          Manage
        </PageHeading>
        <div className="content">
          <StakingPreferenceWrapper>
            <Header>
              Staking preference
            </Header>
            <Item>
              <Left>Unstake threshold</Left>
              <Right>{staking.manage.stakingPreference.unStakeThreshold} warnings</Right>
            </Item>
            <Item>
              <Left>Validator payment</Left>
              <Right>{staking.manage.stakingPreference.validatorPayment} CENNZ</Right>
            </Item>
            <Item>
              <Left />
              <Right>
                <ChangePreferenceButton
                  onClick={() => setChangeStakingPreferenceModalOpen(true)}
                  disabled={intentionsIndex < 0}>
                  Change preference
                </ChangePreferenceButton>
              </Right>
            </Item>
          </StakingPreferenceWrapper>
        </div>
      </MainContent>
      <UnStakeWarningModal {...{isUnStakeWarningModalOpen, setUnStakeWarningModalOpen, onUnStake, stakingWallet, stakingAccount}}/>
      <ChangeStakingPreferenceModal {...{isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen, stakingWallet, stakingAccount, onSaveStakingPreferences }} />
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
