# rUN

---

👋 Welcome to [rUN](https://runanode.io/), the official wallet and UI for the [CENNZNet](https://centrality.ai/), power by [Plug](https://www.plugblockchain.com/).

## Quick start guide

### Start with pre-build docker image

Install docker and docker-compose

Login to docker registry

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

remove all previous local chain data

```bash
rm -rf  ~/Library/Application\ Support/Substrate/chains/development/
```

start application

```bash
yarn install
./scripts/init.sh

yarn dev
or
yarn start
```

## Local test net config

you can update local chain spec under

```bash
./genesis/local/local.json
```

to reset local test net data

```bash
make stop
rm -rf ./target/node_*
make up
```

also after reset local teset net data, make sure remove all previous local chain data

```bash
rm -rf  ~/Library/Application\ Support/Substrate/chains/development/
```


You can host local test net on different machine via the following steps, `10.9.30.55` is the remote machine IP as example

* update local.json localhost to remote server IP address

```javascript
  "bootNodes": [
    "/ip4/10.9.30.55/tcp/30333/p2p/QmReKRKXsWc5T6gQ6EkLqYy6FFzZwi1CMXWUKmE6bMy6JV",
    "/ip4/10.9.30.55/tcp/30334/p2p/QmQZ8TjTqeDj3ciwr93EJ95hxfDsb9pEYDizUAbWpigtQN",
    "/ip4/10.9.30.55/tcp/30335/p2p/QmXiB3jqqn2rpiKU7k1h7NJYeBg8WNSx9DiTRKz9ti2KSK",
    "/ip4/10.9.30.55/tcp/30336/p2p/QmYcHeEWuqtr6Gb5EbK7zEhnaCm5p6vA2kWcVjFKbhApaC"
  ],
  "telemetryEndpoints": [
    [
      "ws://10.9.30.55:1024",
      0
    ]
  ],
```


* update common.js `remoteStreamUrlMap`

```javascript
    remoteStreamUrlMap: {
      ...
      // 'development' : 'ws://localhost:19944',
      'development' : 'ws://10.9.30.55:19944', // for other local test net
    },
```

* restart and choose `Local test net` -> select the modified version of local.json


## Get Started for dev

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

rUN Node log:

```bash
~/Library/Logs/rUN/xxx-node.log
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
