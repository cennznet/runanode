// @flow
import type { Api } from '../../app/renderer/app/api';
import type { ActionsMap } from '../../source/renderer/app/actions';
import type { StoresMap } from '../../source/renderer/app/stores';

export type Odin = {
  api: Api,
  environment: Object,
  actions: ActionsMap,
  stores: StoresMap,
  translations: Object,
  reset: Function,
};

export type WebdriverExecuteResult<T> = { value: T };

export type WebdriverClient = {
  execute: (script: Function) => WebdriverExecuteResult<any>,
  waitUntil: (script: Function, timeout?: number) => Promise<any>,
  url: (url: string) => Promise<any>,
};
