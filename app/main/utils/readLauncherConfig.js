// @flow
import { readFileSync } from 'fs';
import yamljs from 'yamljs';
import path from 'path';
import { app } from 'electron';
import parseArgs from 'minimist';

import type { LauncherConfig } from '../config';
import { Logger, GetLogDir } from './logging';
import { environment } from '../environment';

const { isDev, isTest } = environment;

/**
 * Reads and parses the launcher config yaml file on given path.
 * @param configPath {String}
 * @returns {LauncherConfig}
 */
export default (configPath: ?string): LauncherConfig => {
  Logger.info(`********************************************************`);
  const args = parseArgs(process.argv);
  // $FlowFixMe
  Logger.info(`args: ${JSON.stringify(args)}`);

  Logger.info(`process.argv: ${JSON.stringify(process.argv)}`);

  Logger.info(`app.isPackaged: ${app.isPackaged}`);
  // $FlowFixMe
  Logger.info(`readLauncherConfig, configPath: ${configPath}`);
  // $FlowFixMe
  const { resourcesPath } = process;
  const distPath = path.join(resourcesPath, '..', 'dist');
  // $FlowFixMe
  Logger.info(`process.env.NODE_ENV : ${process.env.NODE_ENV}`);
  // $FlowFixMe
  Logger.info(`isDev : ${isDev}`);
  // $FlowFixMe
  Logger.info(`isTest : ${isTest}`);
  // $FlowFixMe
  Logger.info(`distPath: ${distPath}`);
  Logger.info(`process.resourcesPath: ${resourcesPath}`);
  Logger.info(`process.cwd(): ${process.cwd()}`);
  Logger.info(`app.getAppPath(): ${app.getAppPath()}`);
  Logger.info(`app.getPath('userData'): ${app.getPath('userData')}`);
  Logger.info(`__dirname: ${__dirname}`);

  Logger.info(`********************************************************`);
  /*
[2018-12-26 21:40:56.855] [info] ********************************************************
[2018-12-26 21:40:56.861] [info] readLauncherConfig, configPath: undefined
[2018-12-26 21:40:56.861] [info] resourcesPath: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources
[2018-12-26 21:40:56.861] [info] process.cwd(): /
[2018-12-26 21:40:56.861] [info] app.getAppPath(): /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources/app.asar
[2018-12-26 21:40:56.861] [info] app.getPath('userData'): /Users/kenhuang/Library/Application Support/Odin
[2018-12-26 21:40:56.863] [info] Logger.findLogPath(): /Users/kenhuang/Library/Logs/Odin/log.log
[2018-12-26 21:40:56.863] [info] __dirname: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources/app.asar/app
[2018-12-26 21:40:56.863] [info] distPath: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources/../dist
[2018-12-26 21:40:56.864] [info] distPathNew: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/dist
[2018-12-26 21:40:56.864] [info] ********************************************************

[2018-12-26 21:40:56.864] [info] [main] ODIN_DIST_DIRECTORY: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources/../dist
[2018-12-26 21:40:56.865] [info] [main] ODIN_LOG_DATA_DIRECTORY /Users/kenhuang/Library/Logs/Odin
[2018-12-26 21:40:56.865] [info] [main] ODIN_USER_DATA_DIRECTORY: /Users/kenhuang/Library/Application Support/Odin
[2018-12-26 21:40:56.866] [info] [main] ODIN_INSTALL_DIRECTORY: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/Odin.app/Contents/Resources/app.asar
*/
  const inputYaml = configPath
    ? readFileSync(configPath, 'utf8')
    : readFileSync(path.join(distPath, 'launcher-config.yaml'), 'utf8');
  const finalYaml = inputYaml.replace(/\${([^}]+)}/g, (a, b) => {
    if (process.env[b]) {
      return process.env[b];
    }
    if (b === 'ODIN_INSTALL_DIRECTORY') {
      const ODIN_INSTALL_DIRECTORY = !app.isPackaged ? process.cwd() : app.getAppPath();
      Logger.info(`ODIN_INSTALL_DIRECTORY: ${ODIN_INSTALL_DIRECTORY}`);
      return ODIN_INSTALL_DIRECTORY;
    }
    if (b === 'ODIN_RESOURCE_DIRECTORY') {
      const ODIN_RESOURCE_DIRECTORY = resourcesPath;
      Logger.info(`ODIN_RESOURCE_DIRECTORY: ${ODIN_RESOURCE_DIRECTORY}`);
      return ODIN_RESOURCE_DIRECTORY;
    }
    if (b === 'ODIN_DIST_DIRECTORY') {
      const ODIN_DIST_DIRECTORY = !app.isPackaged ? process.cwd() + '/dist' : distPath;
      Logger.info(`ODIN_DIST_DIRECTORY: ${ODIN_DIST_DIRECTORY}`);
      return ODIN_DIST_DIRECTORY;
    }
    if (b === 'ODIN_USER_DATA_DIRECTORY') {
      const ODIN_USER_DATA_DIRECTORY = !app.isPackaged
        ? process.cwd() + '/dist/user_data'
        : app.getPath('userData');
      Logger.info(`ODIN_USER_DATA_DIRECTORY: ${ODIN_USER_DATA_DIRECTORY}`);
      return ODIN_USER_DATA_DIRECTORY;
    }
    if (b === 'ODIN_LOG_DATA_DIRECTORY') {
      const ODIN_LOG_DATA_DIRECTORY = GetLogDir();
      Logger.info(`ODIN_LOG_DATA_DIRECTORY ${ODIN_LOG_DATA_DIRECTORY}`);
      return ODIN_LOG_DATA_DIRECTORY;
    }
    if (app.getPath(b)) {
      return app.getPath(b);
    }
    Logger.info(`readLauncherConfig: warning var undefined: ${b}`);
    return '';
  });
  // $FlowFixMe
  return yamljs.parse(finalYaml);
};
