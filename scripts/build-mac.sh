#!/bin/bash

set -ex

brew install node@10
export PATH="/usr/local/opt/node@10/bin:$PATH"
node -v

brew install yarn

yarn install
yarn release

cp -rf ./release ./build
