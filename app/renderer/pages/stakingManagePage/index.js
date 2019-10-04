import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import SVGInline from 'react-svg-inline';
import BN from 'bn.js';
import { Balance } from '@cennznet/types';
import R from 'ramda';
import PageSpinner from 'components/PageSpinner';
import { theScanAddressUrl } from 'common/types/theNode.types';
import stakingTokenIcon from 'renderer/assets/icon/staking-token.svg';
import spendingTokenIcon from 'renderer/assets/icon/centrapay.svg';
import themeObject, { colors } from 'theme';
import { Logger } from 'renderer/utils/logging';
import { MainContent, MainLayout } from 'components/layout';
import { PageHeading, Ellipsis } from 'components';
import PageHeaderWithStakingToggle from 'renderer/pages/staking/PageHeaderWithStakingToggle';
import withContainer from './container';
import ClipboardShareLinks from '../wallet/account/transferSectionPage/ClipboardShareLinks';
import useApis from '../stakingOverviewPage/useApis';
import { sortedListWithBalances } from '../staking/utils';

const defaultThemeStyle = p => {
  return {
    iconColor: colors.N0,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ThemableSVGInline = ({ theme, themeKey, children, ...props }) => {
  return <SVGInline {...props}>{children}</SVGInline>;
};

const SpendingTokenIcon = styled(ThemableSVGInline).attrs({
  svg: spendingTokenIcon,
})`
  svg {
    g {
      g {
        stroke: ${p => computedThemeStyle(p).iconColor};
      }
    }
  }
`;

SpendingTokenIcon.defaultProps = {
  theme: themeObject,
  themeKey: 'AppStakingBalanceCard',
};

const StakingTokenIcon = styled(ThemableSVGInline).attrs({
  svg: stakingTokenIcon,
})`
  svg {
    g {
      g {
        stroke: ${p => computedThemeStyle(p).iconColor};
      }
    }
  }
`;

StakingTokenIcon.defaultProps = {
  theme: themeObject,
  themeKey: 'AppStakingBalanceCard',
};

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
  line-height: 1.8rem;
`;

const Item = styled.div`
  background: ${colors.background};
  border-radius: 3px;
  padding: 1rem 1rem 1rem 1rem;
  line-height: 1.5rem;
  & + & {
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

const StakingBalance = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 2rem 2rem 2rem;
  background: ${colors.background};
  border-radius: 3px;
  width: 45%;
`;

const InnerSectionItem = styled.div`
  margin-top: 1rem;
`;

const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(.25);
    opacity: 0;
  }
`;
const InnerSectionItemDiff = styled(InnerSectionItem)`
  color: ${p => (p.children < 0 ? colors.danger : colors.success)};
  visibility: ${p => (p.children === '0' ? 'hidden' : 'visible')};
  animation: ${p => (p.children === '0' ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const InnerSectionItemNum = styled(InnerSectionItem)`
  font-size: 1.8rem;
`;

const StakingBalanceIcon = styled(InnerSectionItem)`
  height: 40px;
`;

const SectionHDivider = styled.div`
  width: 10%;
`;

const SubheadingWrapper = styled.div`
  display: flex;
  line-height: 1.5rem;
`;

const NameInfo = styled.div`
  margin-right: 0.5rem;
`;

const NameText = styled.span`
  padding: 0 0.2rem;
`;

const Subheading = ({ account, wallet }) => {
  const url = theScanAddressUrl.rimu; // TODO should base on selected network
  const { name: walletName } = wallet || {};
  const { name: accountName } = account || {};

  return (
    <SubheadingWrapper>
      <NameInfo>
        Staking account:
        <NameText>
          <Ellipsis substrLength="3" maxLength="6" tailLength="3">
            {walletName || 'N/A'}
          </Ellipsis>
        </NameText>
        :
        <NameText>
          <Ellipsis substrLength="3" maxLength="6" tailLength="3">
            {accountName || 'N/A'}
          </Ellipsis>
        </NameText>
        :
      </NameInfo>
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
        }}
      >
        {account.address}
      </ClipboardShareLinks>
    </SubheadingWrapper>
  );
};
const StakingStakePage = ({
  balances,
  subNav,
  uiState,
  stakingStashWalletId,
  stakingStashAccountAddress,
  wallets,
  onSyncWalletData,
  isStakingStated,
}) => {
  if (!stakingStashAccountAddress) {
    return (
      <MainLayout subNav={subNav}>
        <MainContent display="flex">
          <PageHeading>Manage Staking</PageHeading>
          <div className="content">
            <div>missing stakingStashAccountAddress</div>
          </div>
        </MainContent>
      </MainLayout>
    );
  }

  if (uiState.isProcessing) {
    return (
      <MainLayout subNav={subNav}>
        <MainContent display="flex">
          <PageSpinner message={uiState.message} />
        </MainContent>
      </MainLayout>
    );
  }

  const [rewardValue, setRewardValue] = useState('0');
  const [rewardValueDiff, setRewardValueDiff] = useState('0');
  const [rewardSpendingValue, setRewardSpendingValue] = useState('0');
  const [rewardSpendingValueDiff, setRewardSpendingValueDiff] = useState('0');

  const [intentions, validators] = useApis('getIntentions', 'getValidators');

  // TODO for demo only
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const val = getRandomInt(10);
      setRewardSpendingValue(value => new BN(value, 10).add(new BN(val)).toString(10));
      setRewardSpendingValueDiff(new BN(val).toString(10));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [rewardSpendingValue, rewardSpendingValueDiff]);

  const callbackFn = value => {
    if (Array.isArray(value)) {
      // for system events
      if (value.Type && value.Type === 'EventRecord') {
        value
          .filter(({ event }) => event.section !== 'system')
          .filter(record => record.event) // event.section !== 'system')
          .map(({ event }, index) => {
            const { method, section } = event;
            const document =
              event.meta && event.meta.documentation ? event.meta.documentation.join(' ') : '';
            const defaultType = event.data.typeDef[0].type;
            const defaultData = event.data.toArray()[0];
            if (`${section}.${method}` === 'staking.Reward') {
              const balance: Balance = defaultData;
              const balanceValue = balance.toString() === '0' ? '3' : balance.toString(); // TODO DEMO only, after stake balance become 0
              const validatorNum = 3;
              Logger.debug(
                `balanceValue: ${balanceValue}, validators: ${JSON.stringify(validators)}`
              );
              setRewardValue(myValue =>
                new BN(myValue, 10)
                  .add(new BN(balanceValue, 10).div(new BN(validatorNum)))
                  .toString(10)
              );
              setRewardValueDiff(
                new BN(balanceValue.toString(), 10).div(new BN(validatorNum)).toString(10)
              );
            }

            return defaultData;
          });
      }
    }
    return value;
  };

  // handle system event effect
  useEffect(() => {
    let unsubscribeFn;
    window.appApi.getSystemEvents(callbackFn).then(value => {
      unsubscribeFn = value;
    });
    // useEffect clean up
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  const stakingWallet =
    wallets && !!wallets.length && R.find(R.propEq('id', stakingStashWalletId))(wallets);
  const stakingAccount = stakingWallet ? stakingWallet.accounts[stakingStashAccountAddress] : '';

  // sync wallet data
  useEffect(() => {
    onSyncWalletData({ id: stakingStashWalletId, stakingWallet });
  }, []);

  const [intentionsWithBalances, setIntentionsWithBalances] = useState([]);
  useEffect(() => {
    const sortedIntentions =
      intentions && validators
        ? intentions.filter(accountId => !validators.find(validatorId => validatorId === accountId))
        : [];

    sortedListWithBalances(sortedIntentions, stakingStashAccountAddress, setIntentionsWithBalances);
  }, [validators, intentions]);

  return (
    <MainLayout subNav={subNav}>
      <MainContent display="flex">
        <PageHeaderWithStakingToggle
          heading="Manage staking"
          subHeading={<Subheading {...{ account: stakingAccount, wallet: stakingWallet }} />}
          {...{ isStakingStated, stakingAccount, stakingWallet, intentionsWithBalances }}
        />
      </MainContent>
    </MainLayout>
  );
};

export default withContainer(StakingStakePage);
