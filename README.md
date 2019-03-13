# rUN

---

👋 Welcome to [rUN](https://runanode.io/), the official wallet and UI for the [CENNZNet](https://centrality.ai/), power by [Plug](https://www.plugblockchain.com/).

## Get Started

```bash
./scripts/init.sh
yarn install
```

```bash
yarn dev
```

## Building

```bash
yarn build
or
OPEN_ANALYZER=true yarn build
```

## Packaging

```bash
yarn package
or
yarn package --[option]
```

```bash
yarn package-all
```

## Testing

```bash
yarn test
yarn test -u
yarn test -w
```

```bash
yarn build-e2e or START_MINIMIZED=true yarn build-e2e
yarn test-e2e
```

## Release

```bash
export GITHUB_TOKEN=xxx
yarn release:github
```

## Debug/Logging for packaged app

```bash
open release/mac/Odin.app
tail -f ~/Library/Logs/Odin/*
```

CennzNet Node log:
```bash
~/Library/Logs/Odin/cennznet-node.log
```

Odin application log:
```bash
~/Library/Logs/Odin/log.log
```

Variable can be use in launcher-config.yaml
```bash
ODIN_DIST_DIRECTORY=Odin.app/Contents/dist
ODIN_LOG_DATA_DIRECTORY=~/Library/Logs/Odin
ODIN_USER_DATA_DIRECTORY=~/Library/Application Support/Odin
```

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

```bash
yarn start-renderer-dev
```

Start `Debug Renderer Process` in VSCode

## Pass args on app start

Mac:
open -a /Applications/Odin.app --args --XXXX=true

Windows:
Odin.exe --XXXX=true

## Component development

`yarn styleguide`

## Quick start guide

### Start with pre-build docker image

Install docker and docker-compose

Follow cennzne-node instruction login to centrality docker registry

Start multiple nodes
```bash
make up
```

Check logs
```bash
make logs
or
make logs telemetry
```
Open telemetry UI
```bash
open http://localhost:5000
```

Stop all nodes
```bash
make stop
```

update docker-compose.yml for different node configurations, then run
```bash
make up
```
