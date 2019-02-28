import uuid from 'uuid/v4';
import config from 'app/config';
import appVersion from '../../package.json';

const storage = global.electronStore;
const userId = 'GA_USER_ID';
const ANALYTICS_DISABLED = 'ANALYTICS_DISABLED';

export const enableGoogleAnalytics = () => {
  if (!storage.get(userId)) {
    storage.set(userId, uuid());
  }

  /* eslint-disable */
  if (!window.ga) {
    window.ga = function() {
      (ga.q = ga.q || []).push(arguments);
    };
    ga.l = +new Date();
  }
  /* eslint-enable */

  // window.ga_debug = { trace: true }; // Userd in ga debug mode
  window.ga('create', config.gaTrackId, 'auto');
  window.ga('set', 'checkProtocolTask', null);
  window.ga('set', 'checkStorageTask', null);
  window.ga('set', 'userId', storage.get(userId));
  window.ga('set', 'dimension1', appVersion.version || '0.0.0');
};

export const disableGoogleAnalytics = () => {
  if (storage.get(userId)) {
    storage.delete(userId);
  }

  window.ga = () => ANALYTICS_DISABLED;
};
