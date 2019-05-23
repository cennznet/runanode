// @flow
import os from 'os';
import path from 'path';

import appConfig from 'app/config';
import { NetworkNameMapping } from 'common/types/theNode.types';
import { Logger } from '../utils/logging';
import type { LauncherConfig } from '../launcherConfig';

/**
 * Transforms the launcher config to an array of string args
 *
 * @param config
 * @returns {NodeArgs}
 * @private
 */
export const prepareArgs = (config: LauncherConfig) => {
  const args: Array<string> = config.nodeArgs ? Array.from(config.nodeArgs) : [];
  // default node name
  const nameArgIndex = args.findIndex(item => item === '--name');
  if (nameArgIndex < 0) {
    const { username } = os.userInfo();
    const first = os.userInfo().username.substring(0, 1);
    const last = os.userInfo().username.substring(username.length - 1);
    let maskValue = username.substring(1, username.length - 1);
    if (maskValue.length > 10) {
      maskValue = '**********';
    }
    const mask = maskValue.replace(/\w/g, '*');
    const maskedName = first + mask + last;
    args.push('--name', '❤️' + appConfig.app.name + '-' + maskedName);
  }

  // default chain
  const chainArgIndex = args.findIndex(item => item === '--chain');
  Logger.info(`chainArgIndex, chainArgIndex: ${chainArgIndex}`);
  if (chainArgIndex < 0) {
    let targetChain = appConfig.app.networkOptions[0];
    Logger.info(`chainArgIndex, targetChain: ${targetChain}`);
    // check default config chain is `development` will start with `appConfig.app.developmentGenesisFile` by default
    if (targetChain === NetworkNameMapping.Development) {
      targetChain = path.resolve(appConfig.app.developmentGenesisFile);
    }
    args.push('--chain', targetChain);
  }
  return args;
};
