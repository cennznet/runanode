# cennz-node-ui

---

The Electron App for CENNZ node

## Get Started

```shell
./scripts/init.sh
yarn install
```

```shell
yarn dev
```

## Building

```shell
yarn build
or
OPEN_ANALYZER=true yarn build
```

## Packaging

```shell
yarn package
or
yarn package --[option]
```

```shell
yarn package-all
```

```shell
DEBUG_PROD=true yarn package
```

## Testing

```shell
yarn test
yarn test -u
yarn test -w
```

```shell
yarn build-e2e or START_MINIMIZED=true yarn build-e2e
yarn test-e2e
```

## Release

```shell
export GITHUB_TOKEN=xxx
yarn release:github
```

## Debug/Logging for packaged app

```shell
DEBUG_PROD=true yarn package
open release/mac/Odin.app
tail -f ~/Library/Logs/Odin/*
```

CennzNet Node log:
~/Library/Logs/Odin/cennznet-node.log

Odin application log:
~/Library/Logs/Odin/log.log

Variable can be use in launcher-config.yaml
ODIN_DIST_DIRECTORY=Odin.app/Contents/dist
ODIN_LOG_DATA_DIRECTORY=~/Library/Logs/Odin
ODIN_USER_DATA_DIRECTORY=~/Library/Application Support/Odin

Packaged app structure for mac:

```
─ Odin.app
└── Contents
    ├── PkgInfo
    ├── Info.plist
    ├── Frameworks
    ├── MacOS
    ├── Resources
    ├── dist
        ├── cennznet-node
        └── launcher-config.yaml
```

## Remote debug in VSCode

### Main process
Start `Debug Main Process` in VSCode

### Renderer process
Install debugger-for-chrome
```shell
yarn start-renderer-dev
```
Start `Debug Renderer Process` in VSCode


## Pass args on app start

Mac:
 open -a /path-to-project/cennz-node-ui/release/mac/Odin.app --args --DEBUG_PROD=true


Windows:
Odin.exe --DEBUG_PROD=true
