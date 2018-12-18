#!/bin/bash

set -ex

brew install yarn

yarn install
yarn release

cp -rf ./release ./build
