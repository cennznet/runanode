// @flow
import os from 'os';

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
    args.push('--name', '❤️Odin-' + os.userInfo().username);
  }

  // default chain
  const chainArgIndex = args.findIndex(item => item === '--chain');
  if (chainArgIndex < 0) {
    args.push('--chain', NetworkNameOptions.CENNZNET_RIMU);
  }
  return args;
};
