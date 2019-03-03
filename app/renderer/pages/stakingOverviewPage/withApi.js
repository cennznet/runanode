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
const withOdinApi = apiSection => {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    let didCancel = false;

    window.odin.api.cennz[apiSection](value => {
      if (value) {
        const sortedValue = Array.isArray(value)
          ? value.map(item => item.toString(10))
          : value.toString(10);
        !didCancel && setSectionData(sortedValue);
      }
    });

    return () => {
      window.odin.api.cennz[apiSection]();
      didCancel = true;
    };
  }, []);

  return sectionData;
};

export default withOdinApi;
