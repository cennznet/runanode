#!/bin/bash

set -ex

rm -rf ./dist
mkdir -p ./dist/logs
cd ./dist
wget -O launcher-config-win.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-win.yaml
wget -O launcher-config-mac.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-mac.yaml
wget -O launcher-config-linux.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-linux.yaml

wget -O cennznet-node-win http://cennz-node-ui.s3.amazonaws.com/cennznet-node-win
wget -O cennznet-node-mac http://cennz-node-ui.s3.amazonaws.com/cennznet-node-mac
wget -O cennznet-node-linux http://cennz-node-ui.s3.amazonaws.com/cennznet-node-linux

chmod -R 777 ./
cp ./cennznet-node-mac ./cennznet-node

# steps to sync s3
#s3cmd mb s3://cennz-node-ui
#s3cmd sync -P --acl-public --delete-removed ./dist/ s3://cennz-node-ui/
