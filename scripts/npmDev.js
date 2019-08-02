import path from 'path';
import chalk from 'chalk';
import { spawn, exec } from 'child-process-promise';
import fs from 'fs';

const { log } = console;
const error = chalk.bold.red;
const warning = chalk.bold.yellow;
const success = chalk.bold.green;
const info = chalk.bold.blue;

const nodeFilePath = path.join(__dirname, '..', 'dist', 'cennznet-node');
const MSG_NODE_NOT_EXISTING_WARNING = `The Node file is not existing yet, please wait for fetching Node to ${nodeFilePath}`;
const MSG_NODE_IS_EXISTING_INFO = `Node is located at ${nodeFilePath}`;

function startRenderer() {
  const promise = spawn('npm', ['run', 'start-renderer-dev'], { stdio: 'inherit' });
  const { childProcess } = promise;

  log('[startRenderer spawn] childProcess.pid: ', childProcess.pid);

  childProcess.stdout.on('data', function(data) {
    log(data.toString());
  });
  childProcess.stderr.on('data', function(data) {
    log('[startRenderer spawn] stderr: ', data.toString());
  });

  return promise
    .then(function() {
      log(success('renderer is starting!'));
    })
    .catch(function(err) {
      error('[startRenderer spawn] ERROR: ', error(err));
    });
}

/**
 * Run before npm run dev to set up development environment
 */
async function npmDevScript() {
  if (fs.existsSync(nodeFilePath)) {
    log(info(MSG_NODE_IS_EXISTING_INFO));
  } else {
    log(warning(MSG_NODE_NOT_EXISTING_WARNING));

    await exec(`sh ${path.join(__dirname, 'init.sh')}`);
    await exec(`sh ${path.join(__dirname, 'convert_node.sh')}`);
  }

  await startRenderer();
}

npmDevScript();
