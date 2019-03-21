import { trackEvent, trackPageView } from '@redux-beacon/google-analytics';
import types from 'renderer/types';

const CATEGORY = {
  ANALYTICS: 'analytics',
  WALLET: 'wallet',
  ACCOUNT: 'account',
  STAKING: 'staking',
};

const trackRouterChanged = trackPageView(action => ({
  page: action.payload.location.pathname,
}));

/** ANALYTICS TRACKING */
const trackReEnableAnalytics = trackEvent(action => ({
  category: CATEGORY.ANALYTICS,
  action: 'enable',
  value: 1,
}));

const trackDisableAnalytics = trackEvent(action => ({
  category: CATEGORY.ANALYTICS,
  action: 'disable',
  value: 0,
}));

/** WALLET TRACKING */
const trackCreateWallet = trackEvent(action => ({
  category: CATEGORY.WALLET,
  action: 'create',
  value: 2,
}));

const trackConnectWallet = trackEvent(action => ({
  category: CATEGORY.WALLET,
  action: 'connect',
  value: 1,
}));

const trackRestoreWallet = trackEvent(action => ({
  category: CATEGORY.WALLET,
  action: 'restore',
  value: 0,
}));

/** ACCOUNT TRACKING */
const trackAddAccount = trackEvent(action => ({
  category: CATEGORY.ACCOUNT,
  action: 'add',
  value: 1,
}));

/** STAKING TRACKING */
const trackStakeRequested = trackEvent(action => ({
  category: CATEGORY.STAKING,
  action: 'stake',
  label: 'requested',
  value: 0,
}));

const trackStakeStarted = trackEvent(action => ({
  category: CATEGORY.STAKING,
  action: 'stake',
  label: 'started',
  value: 1,
}));

const trackStakingPreference = trackEvent(action => ({
  category: CATEGORY.STAKING,
  action: 'stake',
  label: 'setPreference',
  value: 2,
}));

const trackUnstakeRequested = trackEvent(action => ({
  category: CATEGORY.STAKING,
  action: 'unstake',
  label: 'requested',
  value: 3,
}));

const trackUnstakeCompleted = trackEvent(action => ({
  category: CATEGORY.STAKING,
  action: 'unstake',
  label: 'completed',
  value: 4,
}));

const eventsMap = {
  '@@router/LOCATION_CHANGE': trackRouterChanged,
  [types.enableAnalytics.triggered]: trackReEnableAnalytics,
  [types.disableAnalytics.triggered]: trackDisableAnalytics,

  [types.walletCreatWithHDKR.completed]: trackCreateWallet,
  [types.walletCreatWithSKR.completed]: trackConnectWallet,
  [types.walletRestoreWithHDKR.completed]: trackRestoreWallet,

  [types.addAccount.completed]: trackAddAccount,

  [types.stake.triggered]: trackStakeRequested,
  [types.stakingExtrinsicCompleted.triggered]: trackStakeStarted,
  [types.stakingSavePreferences.completed]: trackStakingPreference,
  [types.stakingUnStake.requested]: trackUnstakeRequested,
  [types.stakingUnStake.completed]: trackUnstakeCompleted,
};

export default eventsMap;
