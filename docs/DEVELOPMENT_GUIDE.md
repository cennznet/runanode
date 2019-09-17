# rUNanode development guideline

Notice: The default development environment is MacOS, and guideline docs on other platforms is to be added, please feel free to make PRs on adding guide on other platforms

- [rUNanode development guideline](#runanode-development-guideline)
  - [Debugging](#debugging)
  - [Logging](#logging)
  - [Tricks](#tricks)
    - [Remove CENNZnet data](#remove-cennznet-data)
    - [Develop React components](#develop-react-components)
    - [Standalone testnet](#standalone-testnet)



## Debugging

```bash
# Debug in production
open -a /Applications/rUN.app --args --DEBUG_PROD=true

## Windows
rUN.exe --DEBUG_PROD=true
```

## Logging

```bash
# Application logging in production
tail -f ~/Library/Logs/runanode/log.log
```

```bash
# CENNZnet Node logging in development
tail -f ./dist/logs/cennznet-node.log

# CENNZnet Node logging in production
tail -f ~/Library/Logs/runanode/cennznet-node.log
```

## Tricks

### Remove CENNZnet data

Whenever you want to remove CENNZnet chain data folder

```bash
# remove CENNZnet chain data
cd ~/Library/Application\ Support/Substrate/chains

# Then remove relative folders, for example:
rm -rf development
```

### Develop React components

When you work on React components (`src/renderer/components/**`), you could check its documents and test without starting the app by running

```bash
npm run styleguide
```

### Standalone testnet

You may want to run a standalone network for testing, checkout [How to host a standalone testnet in your machine][standalone_testnet].

[standalone_testnet]: docs/STANDALONE_TESTNET.md
