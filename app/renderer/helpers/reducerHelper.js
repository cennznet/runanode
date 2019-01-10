import { map } from 'ramda';

const emptyFn = state => state;

const composeHandlerFns = (fns, initState) =>
  fns.reduce((a, b) => (state, ...others) => b(a(state || initState, ...others), ...others));

const composeHandlerMap = (maps) => {
  if (Array.isArray(maps)) {
    const handlerMap = {};

    const getFns = (key) => {
      let fns = handlerMap[key];
      if (!fns) {
        fns = [];
        handlerMap[key] = fns;
      }
      return fns;
    };

    for (const m of maps) {
      for (const [key, value] of Object.entries(m)) {
        const fns = getFns(key);
        if (Array.isArray(value)) {
          fns.push(...value);
        } else {
          fns.push(value);
        }
      }
    }

    return handlerMap;
  }
  return maps;
};

const createChainFns = (handlerMaps, initState, postFns = []) => {
  const handlerMap = composeHandlerMap(handlerMaps);
  const fnMap = map(fns => composeHandlerFns([].concat(fns || emptyFn, postFns), initState), handlerMap);
  return (state, { type, payload, meta, error }) => {
    const fn = fnMap[type];
    if (fn) {
      return fn(state, payload, meta, error);
    }
    return state || initState;
  };
};

export default createChainFns;
