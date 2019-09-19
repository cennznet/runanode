# Standalone testnet

## Get started

### 1. Start up testnet

```bash
# To start up testnet docker
make up

# Check docker logs
make logs

# Notice: Check out `Makefile` for available standalone-testnet docker commands
```

### 2. Monitor testnet

To ensure the testnet is starting to work, visit the telemetry to see if all validators are syncing blocks

```txt
http://localhost:5000
```

### 3. Configure rUNanode

- Config `localStreamUrl` and `remoteStreamUrlMap/development` in `config/common.js`;
- Run `npm run dev` to start rUNanode in development mode, or run `npm run release` to get packed rUNanode and run in production mode;

### 4. Connect rUNanode to standalone testnet

- After starting rUNanode software, go to `choose network` page;
- Select `Self hosted net` option in the dropdown list;
- Upload the genesis file (`src/genesis/local/local.json`);
- Go to the next page (Ensure `rUNanode` blockchain data folder has been cleared whenever the testnet blockchain folder is cleared);

## Deposit tokens into rUNanode

Go to CENNZnet/Polkadot UI for token deposit, manual with more details can be found [here]()

```txt
http://localhost:3000
```

## Configure standalone testnet

Standalone testnet can be configured via genesis json file (for example: `src/genesis/local/local.json`):

```js
{
  "staking": {
    "sessionsPerEra": 5 // The number can be decreased to shorten Era period, to test rewarding, validator entering/exiting, etc in a fast way
  }
}
```

**NOTICE:**

- rUNanode and testnet must share the same genesis file;
- Whenever genesis file is reconfigured, both rUNanode and testnet blockchain folders have to be cleared;

## Clean up testnet blockchain data folder

The testnet blockchain data folder is in `runanode/target/*` which has been git-ignored. to clean up testnet blockchain data:

```bash
rm -rf target/**
```

## Clean up rUNanode blockchain data folder

```bash
# remove CENNZnet chain data
cd ~/Library/Application\ Support/Substrate/chains
rm -rf testnet-name
```

## Set up standalone testnet in intranet

Sometimes you may want host testnet on one machine, and multiple nodes can connect with it in an intranet:

- Use `src/genesis/local/intra-testnet.json` as a genesis file template, replace `xx.xx.xx.xx` with the ip address of your testnet hosting machine;
- In `docker-compose.yml`, replace `--chain=/mnt/genesis/local/local.json` with `--chain=/mnt/genesis/local/intra-testnet.json`;
- Follow the same steps of configuring standalone testnet in your local machine;

## Generate genesis file

`runanode/genesis/local.json` is the standalone testnet genesis file, which is derived from `https://github.com/cennznet/cennznet/tree/master/genesis/rimu/readable.json`.
Whenever `cennznet/cennznet` is upgraded, or `cennznet/genesis/*` has changes, we need to update the genesis file templates in rUNanode repository.

## Relavant files

```txt
|-- genesis
    |-- local
        |-- intra-testnet.json (For setting up testnet on a machine with specific IP address)
        |-- local.json (For setting up testnet on local machine)
|-- docker-compose.yml (For configuring testnet docker and start validator nodes)
|-- Makefile (Testnet docker commands)
```
