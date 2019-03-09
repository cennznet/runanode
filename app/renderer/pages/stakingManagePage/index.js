import React, { useState } from 'react';
import styled from 'styled-components';
import SVGInline from "react-svg-inline";

import centrapayIcon from 'renderer/assets/icon/centrapay.svg';
import cennzIcon from 'renderer/assets/icon/cennz.svg';
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
import SavePreferenceSection from './SavePreferenceSection';

const CentrapayIcon = styled(SVGInline).attrs({
  svg: centrapayIcon,
})`
  width: auto;
`;

const CennzIcon = styled(SVGInline).attrs({
  svg: cennzIcon,
})`
  width: auto;
`;

const UnStakeButton = styled(Button)`
  position: absolute;
  right: 0rem;
`;

const SectionLayoutWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const SectionLayoutInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;
  height: 30rem;
`;

const Right = styled.div`
  width: 30%;
  padding: 0rem 0rem 0rem 1rem;
`;

const ItemTitle = styled.div`
  color: ${colors.textMuted};
  line-height: 1.8rem;;
`;

const ItemNum = styled.span`
  font-size: 1.8rem;
`;

const Item = styled.div`
  background-color: ${colors.V900};
  border-radius: 3px;
  padding: 1rem 1rem 1rem 1rem;
  line-height: 1.5rem;
  &+& {
    margin-top: 1rem;
  }
`;

const WarningContent = styled.div`
  color: ${colors.warning};
`;

const PunishmentContent = styled.div`
  color: ${colors.danger};
`;

const RewardContent = styled.div`
  color: ${colors.success};
`;

const InnerSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 2rem 2rem 2rem;
  background-color: ${colors.V900};
  border-radius: 3px;
  width: 45%;
`;

const InnerSectionItem = styled.div`
  margin-top: 1rem;
`;

const InnerSectionItemDiff = styled(InnerSectionItem)`
  color: ${p => p.children > 0 ? colors.success : colors.danger}
`;

const InnerSectionItemNum = styled(InnerSectionItem)`
  font-size: 1.8rem;
`;

const InnerSectionItemIcon = styled(InnerSectionItem)`
  height: 8rem;
`;

const SectionHDivider = styled.div`
  width: 10%;
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
  const stakingAccountAddress = Object.keys(window.odin.store.getState().localStorage.WALLETS[0].accounts)[0];
  const stakingAccount: CennznetWalletAccount = window.odin.store.getState().localStorage.WALLETS[0].accounts[stakingAccountAddress];

  const [intentions, validatorPreferences] = useApis(
    'getIntentions',
    [
      'getValidatorPreferences',
      { noSubscription: false, params: [stakingAccountAddress] },
    ]
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
          Manage Staking
        </PageHeading>
        <div className="content">
          <SectionLayoutWrapper>
            <Left>
              <SectionLayoutInnerWrapper>
                <InnerSectionWrapper>
                  <ItemTitle>Spending balance</ItemTitle>
                  <InnerSectionItemIcon>
                    <CennzIcon />
                  </InnerSectionItemIcon>
                  <InnerSectionItem>CENNZ</InnerSectionItem>
                  <InnerSectionItemNum>73,254.86</InnerSectionItemNum>
                  <InnerSectionItemDiff>120</InnerSectionItemDiff>
                </InnerSectionWrapper>
                <SectionHDivider/>
                <InnerSectionWrapper>
                  <ItemTitle>Spending balance</ItemTitle>
                  <InnerSectionItemIcon>
                    <CentrapayIcon />
                  </InnerSectionItemIcon>
                  <InnerSectionItem>CPAY</InnerSectionItem>
                  <InnerSectionItemNum>73,254.86</InnerSectionItemNum>
                  <InnerSectionItemDiff>-120</InnerSectionItemDiff>
                </InnerSectionWrapper>
              </SectionLayoutInnerWrapper>
              <SavePreferenceSection {...{validatorPreferences, setChangeStakingPreferenceModalOpen, intentionsIndex}}/>
            </Left>
            <Right>
              <Item>
                <ItemTitle>Warning received</ItemTitle>
                <WarningContent>
                  <ItemNum>1</ItemNum> warning
                </WarningContent>
              </Item>
              <Item>
                <ItemTitle>Punishment</ItemTitle>
                <PunishmentContent>
                  <ItemNum>120</ItemNum> CENNZ
                </PunishmentContent>
              </Item>
              <Item>
                <ItemTitle>Reward</ItemTitle>
                <RewardContent>
                  <ItemNum>230</ItemNum> CPAY
                </RewardContent>
              </Item>
            </Right>

          </SectionLayoutWrapper>
        </div>
      </MainContent>
      <UnStakeWarningModal {...{isUnStakeWarningModalOpen, setUnStakeWarningModalOpen, onUnStake, stakingWallet, stakingAccount}}/>
      <ChangeStakingPreferenceModal {...{isChangeStakingPreferenceModalOpen, setChangeStakingPreferenceModalOpen, stakingWallet, stakingAccount, onSaveStakingPreferences }} />
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
