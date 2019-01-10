import * as R from 'ramda';

export const initialState = {
  uiStatus: {
    pending: false,
    error: null,
    requests: {}
  }
};

const getError = R.pipe(R.values, R.map(x => x.error), R.filter(x => x != null), R.head);

const getRequest = (name, payload, meta) => {
  if (typeof name === 'string') {
    return {
      name
    };
  }
  const result = name(payload, meta);
  if (typeof result === 'string') {
    return {
      name: result
    };
  }
  return result;
};

export const setActionLoadingOn = actionName => ({ uiStatus, ...others }, payload, meta) => {
  const req = getRequest(actionName, payload, meta);
  const newRequests = {
    ...uiStatus.requests,
    [req.name]: {
      ...req,
      pending: true,
      error: null
    }
  };
  return {
    ...others,
    uiStatus: {
      ...uiStatus,
      pending: true,
      error: getError(newRequests),
      requests: newRequests
    }
  };
};

export const setLoadingOn = setActionLoadingOn('action');

const getPending = R.pipe(R.values, R.any(x => x.pending));

export const setActionLoadingOff = actionName => ({ uiStatus, ...others }, payload, meta, error) => {
  const req = getRequest(actionName, payload, meta);
  const newRequests = {
    ...uiStatus.requests,
    [req.name]: {
      ...req,
      pending: false,
      error: error ? (payload || true) : null
    }
  };
  return {
    ...others,
    uiStatus: {
      ...uiStatus,
      pending: getPending(newRequests),
      error: error ? (payload || true) : uiStatus.error,
      requests: newRequests
    }
  };
};

export const setLoadingOff = setActionLoadingOff('action');

const getActionNameFn = (action, name = action.requested) => {
  if (typeof name === 'string') {
    return () => ({ name, type: action.requested });
  }
  return (payload, meta) => {
    const result = name(payload, meta);
    if (typeof result === 'string') {
      return {
        name: result,
        type: action.requested
      };
    }
    let actionName = action.requested;
    if (result.id) {
      actionName += `/${result.id}`;
    }
    return {
      type: action.requested,
      name: actionName,
      ...result
    };
  };
};

export const setActionLoading = (action, name) => {
  const actionNameFn = getActionNameFn(action, name);
  return {
    [action.requested]: setActionLoadingOn(actionNameFn),
    [action.completed]: setActionLoadingOff(actionNameFn),
    [action.failed]: setActionLoadingOff(actionNameFn),
    [action.cancelled]: setActionLoadingOff(actionNameFn)
  };
};
