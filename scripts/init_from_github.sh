#!/bin/bash

set -ex

export GITHUB_TOKEN='cd09e55577c587dbd942c4036117dd5bdbbec245'
export RELEASE_VERSION='0.2.5'


rm -rf ./dist
mkdir -p ./dist/logs

./scripts/github-release-get.sh cennznet-node-mac-$RELEASE_VERSION ./dist/cennznet-node-mac
./scripts/github-release-get.sh cennznet-node-win-$RELEASE_VERSION.exe ./dist/cennznet-node-win
./scripts/github-release-get.sh cennznet-node-linux-$RELEASE_VERSION ./dist/cennznet-node-linux

wget -O ./dist/launcher-config-win.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-win.yaml
wget -O ./dist/launcher-config-mac.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-mac.yaml
wget -O ./dist/launcher-config-linux.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-linux.yaml

chmod -R 777 ./dist/
cp ./dist/cennznet-node-mac ./dist/cennznet-node
