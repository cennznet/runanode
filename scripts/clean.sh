#!/bin/bash

set -ex

rm -rf ./app/dist
rm -rf ./app/main.prod.js*
rm -rf ./dll
rm -rf ./release
rm -rf ./node_modules

yarn install
./scripts/init.sh