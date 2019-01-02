// @flow
import { readFileSync } from 'fs';
import yamljs from 'yamljs';
import path from 'path';
import { app } from 'electron';

import type { LauncherConfig } from '../config';
import { Logger, GetLogDir } from './logging';
import { environment } from '../environment';

const { isDevOrDebugProd, isDev, isDebugProd, isTest } = environment;

/**
 * Reads and parses the launcher config yaml file on given path.
 * @param configPath {String}
 * @returns {LauncherConfig}
 */
export const readLauncherConfig = (configPath: ?string): LauncherConfig => {
  Logger.info(`********************************************************`);
  // $FlowFixMe
  Logger.info(`readLauncherConfig, configPath: ${configPath}`);
  // $FlowFixMe
  const { resourcesPath } = process;
  const distPath = path.join(resourcesPath, '..', 'dist')
  // $FlowFixMe
  Logger.info(`process.env.NODE_ENV : ${process.env.NODE_ENV}`);
  // $FlowFixMe
  Logger.info(`process.env.DEBUG_PROD : ${process.env.DEBUG_PROD}`);
  // $FlowFixMe
  Logger.info(`isDevOrDebugProd : ${isDevOrDebugProd}`);
  // $FlowFixMe
  Logger.info(`isDebugProd : ${isDebugProd}`);
  // $FlowFixMe
  Logger.info(`isDev : ${isDev}`);
  // $FlowFixMe
  Logger.info(`isTest : ${isTest}`);
  // $FlowFixMe
  Logger.info(`isDevOrDebugProd : ${isDevOrDebugProd}`);
  Logger.info(`distPath: ${distPath}`);
  Logger.info(`process.resourcesPath: ${resourcesPath}`);
  Logger.info(`process.cwd(): ${process.cwd()}`);
  Logger.info(`app.getAppPath(): ${app.getAppPath()}`);
  Logger.info(`app.getPath('userData'): ${app.getPath('userData')}`);
  Logger.info(`Logger.findLogPath(): ${Logger.findLogPath()}`);
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
  const inputYaml = configPath ? readFileSync(configPath, 'utf8') : readFileSync(distPath+"/launcher-config.yaml" , 'utf8');
  const finalYaml = inputYaml.replace(/\${([^}]+)}/g,
    (a, b) => {
      if (process.env[b]) {
        return process.env[b];
      }
      if (b === 'ODIN_INSTALL_DIRECTORY') {
        const ODIN_INSTALL_DIRECTORY = isDevOrDebugProd ? process.cwd() : app.getAppPath();
        Logger.info(`ODIN_INSTALL_DIRECTORY: ${ODIN_INSTALL_DIRECTORY}`);
        return ODIN_INSTALL_DIRECTORY;
      }
      if (b === 'ODIN_RESOURCE_DIRECTORY') {
        const ODIN_RESOURCE_DIRECTORY = resourcesPath;
        Logger.info(`ODIN_RESOURCE_DIRECTORY: ${ODIN_RESOURCE_DIRECTORY}`);
        return ODIN_RESOURCE_DIRECTORY;
      }
      if (b === 'ODIN_DIST_DIRECTORY') {
        const ODIN_DIST_DIRECTORY = isDevOrDebugProd ? process.cwd() + '/dist' : distPath;
        Logger.info(`ODIN_DIST_DIRECTORY: ${ODIN_DIST_DIRECTORY}`);
        return ODIN_DIST_DIRECTORY;
      }
      if (b === 'ODIN_USER_DATA_DIRECTORY') {
        const ODIN_USER_DATA_DIRECTORY = isDevOrDebugProd ? process.cwd() + '/dist/user_data': app.getPath('userData');
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
    }
  );
  // $FlowFixMe
  return yamljs.parse(finalYaml);
};
