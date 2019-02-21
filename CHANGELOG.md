# Changelog

# vNext

### Features
- add CENNZScan address link to account public address

### Fixes

### Improvements
- tidy up asset table layout
- update background gradient settings
- update field text bg color to match with design
- update sync info layout
- update side bar nav for launch process
- display node state in dev info top bar
- skip restart node when chose same network
- add bps to sync screen
- Refactor configure

# v0.5.0 (2019.02.20)

### Features

- able to send tx
- add Yup validations for send tx

### Fixes

- fix switch network issues

### Improvements

- Make 'Local test net' optional

# v0.4.1 (2019.02.12)

### Features

- Add tabs and scrollable components
- new data structure to store Wallets -> Accounts -> Assets
- Connect wallet with both HDKeyring and SimpleKeyring
- Able to display balance in Account detail page
- Add send tx confirmation flow

### Fixes

- fix cucumber not able to start issue
- able to check cennznet-node process in tests

### Improvements

- able to run `yarn cucumber` test in CI
- update refresh rate to 5s
- Improved styleguide
- upgrade to Rimu CENNZNETNode

# v0.3.1 (2019.01.31)

### Improvements

- Refactor reducer
- able to detect app state and able to show spinner on exit
- Single page seed phase PDF design
- Added download seed phrase confirm modal

# v0.3.0 (2019.01.27)

### Features

- Start up process
  (initial Node start && root route control)
- SyncNode page navigation after 100% synced
- able to handle hex blockNum
- add clean.sh to fix console undefine issue
- able to set default node args, default node name is Odin-USERNAME
- integrated cennznet-api
- make yarn install works with gemfury
- enable PR build with Jenkins
- Add Google Analytics
- able to create wallet from DEV page, sync to redux state and electron-storage
- Add checkbox component
- Add wallet details page
- able to generate pdf

### Fixes

- fix static link issue for cennznet-node windows and mac build

### Improvements

- networkOptions && genesisFile data storage
- default dev tools open on the right side
- rename ./npmrc to ./npmrc.template
- upgrade cennznet-api and cennznet-wallet to 0.5.2
- disable redux-log by default
- Change page layout and color themes
- support multiple wallets
- Refine secondary button

# v0.2.4 (2019.01.16)

### Improvements

- new logo
- change default remote URL to dev
- able to use `yarn package-win`

# v0.2.3 (2019.01.16)

### Improvements

- ready for demo
- able to switch network via UI
- basic screen flow

## v0.2.2 (2019.01.13)

### Fixes

- fix hot reload issue

### Improvements

- Able launch app with runtime parameter
- Able to launch app with cennznet-node in windows
- Add ./scripts/init.sh to init dev env
- Add Select, Input, Spinner components into Styleguidist
- able to make network request
- able to restart cennznet node with options
- Connect TopBarContainer to redux state
- Add JsonRPC support
- Add Websocket support
- Able to display network status

## v0.2.1 (2019.01.04)

#### Improvements

- Add Styleguidist for components development

## v0.2.0 (2019.01.04)

#### Features

- Add ToS page
- Add Button, Spinner components

## v0.1.2 (2019.01.02)

#### Features

- Able launch remote debug in vscode for main and renderer
- Able to run `yarn cucumber` for integration test
- Added preload.js script for security
- Able to run cennnznet-node as part of the app

## v0.1.1 (2018.12.26)

#### Features

- Able to process launch config and out put logs on mac

## v0.0.3 (2018.12.25)

#### Features

- Upgrade to the latest version of electron-react-boilerplate

## v0.0.2 (2018.12.20)

#### Features

- Able to show sync percentage

## v0.0.1 (2018.12.05)

#### Features

- initial project setup
