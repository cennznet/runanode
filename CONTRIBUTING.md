# Contributing to runanode

## Make pull requests

- Rebase `master` branch into your current working branch;
- Squash commits into one commit before making a PR to keep a clean git history;
- Label `please review` when PR is ready to review;

## Set up development environment

Check out source code

```bash
brew install jq // Or similar appoach on Linux and Windows
npm i
npm run dev
```

Notice - if you are not able to start the app, check if `cennznet-node` is in `dist` folder; if not, check with the maintainers, as the automatic processing is still under development.

## Development

After entering runanode app, there are two options to connect to test network - Rimu(UAT) or local-testnet (under development), select joining into Rimu network, for example, and then cennznet-node running behind the Electron runanode app will connect and sync with the network.

Developers are able to navigate to a target page in development mode, without need to wait for 100% fully synced.

Please read through [development guide][development_guide] for more technical details

[development_guide]: docs/DEVELOPMENT_GUIDE.md
