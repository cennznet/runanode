import { useState, useEffect } from 'react';
import BlockNumber from '@polkadot/types/type/BlockNumber';
import { ValidatorPrefs } from '@polkadot/types';
import BN from 'bn.js';

import { Logger } from 'renderer/utils/logging';

/**
 * Only apply to pokadolt-api
 * Except when the cennz-sdk accept callbackFn and require subscribe
 *
 * Naming Convention in window.appApi.api
 * action-section : getEraLength
 *
 * Futuer TODO List:
 * Integrate both (sdk)api with once return value and api requires subscription
 *
 * didCancel variables
 * https://github.com/facebook/react/issues/14369
 */
const useApi = (apiSection, { noSubscription, params = [] } = {}) => {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    let didCancel = false;
    let unsubscribeFn;

    if (noSubscription) {
      window.appApi[apiSection](...params).then(
        value => !didCancel && value && setSectionData(value.toString(10))
      );
    } else {
      const callbackFn = value => {
        if (value) {
          let sortedValue;
          if (Array.isArray(value)) {
            sortedValue = value.map(item => item.toString(10));
          }
          if (value instanceof ValidatorPrefs) {
            sortedValue = value;
          }
          if (value instanceof BlockNumber) {
            sortedValue = value.toString(10);
          }
          if (value instanceof BN) {
            sortedValue = value.toString(10);
          }
          if (!sortedValue) {
            sortedValue = value;
          }
          !didCancel && setSectionData(sortedValue);
        }
      };
      if (params) {
        window.appApi[apiSection](...params, callbackFn).then(value => {
          unsubscribeFn = value;
        });
      } else {
        window.appApi[apiSection](callbackFn).then(value => {
          unsubscribeFn = value;
        });
      }
    }

    // useEffect clean up
    return () => {
      if (typeof unsubscribeFn === 'function' ) {
        Logger.debug(
          `useApi, useEffect clean up, apiSection: ${apiSection}, unsubscribeFn: ${unsubscribeFn}`
        );
        unsubscribeFn();
      }
      didCancel = true;
    };
  }, []);

  return sectionData;
};

export default useApi;
