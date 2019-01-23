import uuid from 'uuid/v4';
import config from 'app/config';
import appVersion from '../../package.json';

const storage = global.electronStore;
const userId = 'GA_USER_ID';

const setUpGoogleAnalytics = () => {
  if (!storage.get(userId)) {
    storage.set(userId, uuid());
  }

  if (window.ga) {
    window.ga_debug = { trace: true }; // Userd in ga debug mode
    window.ga('create', config.gaTrackId, 'auto');
    window.ga('set', 'checkProtocolTask', null);
    window.ga('set', 'checkStorageTask', null);
    window.ga('set', 'userId', storage.get(userId));
    window.ga('set', 'dimension1', appVersion.version || '0.0.0');
  } else {
    console.error('window.ga is not defined');
  }
};

export default setUpGoogleAnalytics;
