// @flow
import os from 'os';

import appConfig from 'app/config';
import { NetworkNameOptions } from 'common/types/cennznet-node.types';
import type { LauncherConfig } from '../launcherConfig';

/**
 * Transforms the launcher config to an array of string args
 * which can be passed to the cennznet-node process.
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
    if(maskValue.length > 10) {
      maskValue = '**********';
    }
    const mask = maskValue.replace(/\w/g,"*");
    const maskedName = first + mask + last;
    args.push('--name', '❤️' + appConfig.app.name + '-' + maskedName);
  }

  // default chain
  const chainArgIndex = args.findIndex(item => item === '--chain');
  if (chainArgIndex < 0) {
    args.push('--chain', NetworkNameOptions.CENNZNET_RIMU);
  }
  return args;
};
