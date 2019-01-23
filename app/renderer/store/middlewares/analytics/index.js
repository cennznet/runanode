import { createMiddleware } from 'redux-beacon';
import GoogleAnalytics, { trackEvent, trackPageView } from '@redux-beacon/google-analytics';
import beaconLogger from '@redux-beacon/logger';
import eventsMap from './eventsMap';

const gaMiddleware = ({ logger = false }) =>
  createMiddleware(eventsMap, GoogleAnalytics(), logger ? { logger: beaconLogger } : {});

export default gaMiddleware;
