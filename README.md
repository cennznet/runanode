# cennz-node-ui

---

The Electron App for CENNZ node

## Get Started

```shell
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
