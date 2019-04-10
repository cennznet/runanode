// @flow
import { readFileSync } from 'fs';
import yamljs from 'yamljs';
import path from 'path';
import { app } from 'electron';
import parseArgs from 'minimist';

import { environment } from 'common/environment';
import type { LauncherConfig } from '../launcherConfig';
import { Logger, GetLogDir } from './logging';

const { isDevOrDebugProd, isDev, isTest } = environment;

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
  Logger.info(`isDevOrDebugProd : ${isDevOrDebugProd}`);
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
[2018-12-26 21:40:56.861] [info] resourcesPath: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources
[2018-12-26 21:40:56.861] [info] process.cwd(): /
[2018-12-26 21:40:56.861] [info] app.getAppPath(): /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources/app.asar
[2018-12-26 21:40:56.861] [info] app.getPath('userData'): /Users/kenhuang/Library/Application Support/App
[2018-12-26 21:40:56.863] [info] Logger.findLogPath(): /Users/kenhuang/Library/Logs/App/log.log
[2018-12-26 21:40:56.863] [info] __dirname: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources/app.asar/app
[2018-12-26 21:40:56.863] [info] distPath: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources/../dist
[2018-12-26 21:40:56.864] [info] distPathNew: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/dist
[2018-12-26 21:40:56.864] [info] ********************************************************

[2018-12-26 21:40:56.864] [info] [main] APP_DIST_DIRECTORY: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources/../dist
[2018-12-26 21:40:56.865] [info] [main] APP_LOG_DATA_DIRECTORY /Users/kenhuang/Library/Logs/App
[2018-12-26 21:40:56.865] [info] [main] APP_USER_DATA_DIRECTORY: /Users/kenhuang/Library/Application Support/App
[2018-12-26 21:40:56.866] [info] [main] APP_INSTALL_DIRECTORY: /Users/kenhuang/git/CENNZNode/lunch/cennz-node-ui/release/mac/App.app/Contents/Resources/app.asar
*/
  const inputYaml = configPath
    ? readFileSync(configPath, 'utf8')
    : readFileSync(path.join(distPath, 'launcher-config.yaml'), 'utf8');
  const finalYaml = inputYaml.replace(/\${([^}]+)}/g, (a, b) => {
    if (process.env[b]) {
      return process.env[b];
    }
    if (b === 'APP_INSTALL_DIRECTORY') {
      const APP_INSTALL_DIRECTORY = !app.isPackaged ? process.cwd() : app.getAppPath();
      Logger.info(`APP_INSTALL_DIRECTORY: ${APP_INSTALL_DIRECTORY}`);
      return APP_INSTALL_DIRECTORY;
    }
    if (b === 'APP_RESOURCE_DIRECTORY') {
      const APP_RESOURCE_DIRECTORY = resourcesPath;
      Logger.info(`APP_RESOURCE_DIRECTORY: ${APP_RESOURCE_DIRECTORY}`);
      return APP_RESOURCE_DIRECTORY;
    }
    if (b === 'APP_DIST_DIRECTORY') {
      const APP_DIST_DIRECTORY = !app.isPackaged ? process.cwd() + '/dist' : distPath;
      Logger.info(`APP_DIST_DIRECTORY: ${APP_DIST_DIRECTORY}`);
      return APP_DIST_DIRECTORY;
    }
    if (b === 'APP_USER_DATA_DIRECTORY') {
      const APP_USER_DATA_DIRECTORY = !app.isPackaged
        ? process.cwd() + '/dist/user_data'
        : app.getPath('userData');
      Logger.info(`APP_USER_DATA_DIRECTORY: ${APP_USER_DATA_DIRECTORY}`);
      return APP_USER_DATA_DIRECTORY;
    }
    if (b === 'APP_LOG_DATA_DIRECTORY') {
      const APP_LOG_DATA_DIRECTORY = GetLogDir();
      Logger.info(`APP_LOG_DATA_DIRECTORY ${APP_LOG_DATA_DIRECTORY}`);
      return APP_LOG_DATA_DIRECTORY;
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
