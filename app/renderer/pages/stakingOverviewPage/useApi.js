import { useState, useEffect } from 'react';
/**
 * Only apply to pokadolt-api
 * Except when the cennz-sdk accept callbackFn and require subscribe
 *
 * Naming Convention in window.odin.api
 * action-section : getEraLength
 *
 * Futuer TODO List:
 * Integrate both (sdk)api with once return value and api requires subscription
 *
 * didCancel varibales
 * https://github.com/facebook/react/issues/14369
 */
const useApi = (apiSection, { noSubscription, params = [] } = {}) => {
  const [sectionData, setSectionData] = useState(null);
  const [notSubscribe] = useState(noSubscription);
  const [paramsToAssign] = useState(params);

  useEffect(() => {
    let didCancel = false;

    if (noSubscription) {
      window.odin.api.cennz[apiSection](...params).then(
        value => !didCancel && value && setSectionData(value.toString(10))
      );
    } else {
      window.odin.api.cennz[apiSection](value => {
        if (value) {
          const sortedValue = Array.isArray(value)
            ? value.map(item => item.toString(10))
            : value.toString(10);
          !didCancel && setSectionData(sortedValue);
        }
      });
    }

    return () => {
      window.odin.api.cennz[apiSection]();
      didCancel = true;
    };
  }, []);

  return sectionData;
};

export default useApi;
