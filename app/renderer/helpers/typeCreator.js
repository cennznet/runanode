import { map } from 'ramda';

const prefixProvider = namespace => actionTypeCreator => (name) => {
  const prefix = `${namespace}_${name.toUpperCase()}`;

  return actionTypeCreator(prefix);
};

const addRemoveActionTypes = prefix => (
  {
    added: `${prefix}_ADDED`,
    removed: `${prefix}_REMOVED`,
  }
);

const apiActionTypes = prefix => (
  {
    requested: `${prefix}_REQUESTED`,
    completed: `${prefix}_COMPLETED`,
    failed: `${prefix}_FAILED`,
    cancelled: `${prefix}_CANCELLED`,
  }
);

const changedActionTypes = prefix => (
  { changed: `${prefix}_CHANGED` }
);

const toggledActionTypes = prefix => (
  { toggled: `${prefix}_TOGGLED` }
);

const formActionTypes = prefix => (
  { reset: `${prefix}_RESET` }
);

const triggerActionTypes = prefix => (
  { triggered: `${prefix}_TRIGGERED` }
);

const subscriptionActionTypes = prefix => ({
  subscribe: `${prefix}_SUBSCRIBE`,
  unsubscribe: `${prefix}_UBSUBSCRIBE`
});

const getActionTypeCreators = (namespace) => {
  if (!namespace) {
    throw new Error('Please give valid namespace');
  }
  const providePrefix = prefixProvider(namespace);
  return map(providePrefix, {
    apiActionTypes,
    changedActionTypes,
    toggledActionTypes,
    formActionTypes,
    addRemoveActionTypes,
    triggerActionTypes,
    subscriptionActionTypes
  });
};

export default getActionTypeCreators;
