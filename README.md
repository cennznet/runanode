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
open release/mac/rUN.app
tail -f ~/Library/Logs/rUN/*
```

CennzNet Node log:

```bash
~/Library/Logs/rUN/cennznet-node.log
```

Application log:

```bash
~/Library/Logs/rUN/log.log
```

Variable can be use in launcher-config.yaml

```bash
APP_DIST_DIRECTORY=rUN.app/Contents/dist
APP_LOG_DATA_DIRECTORY=~/Library/Logs/rUN
APP_USER_DATA_DIRECTORY=~/Library/Application Support/rUN
```

Packaged app structure for mac:

```
─ rUN.app
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
open -a /Applications/rUN.app --args --DEBUG_PROD=true

Windows:
rUN.exe --DEBUG_PROD=true

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

## Auto upgrade

Test auto upgrade with minio

```bash
brew install minio/stable/minio
brew services stop minio/stable/minio
minio server ~/minio-data

export CSC_LINK=xxx
export CSC_KEY_PASSWORD=xxx
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx

yarn release:minio
```
