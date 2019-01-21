#!/bin/bash

set -ex

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# install node and npm
nvm install v10.*
#brew install node@10
#export PATH="/usr/local/opt/node@10/bin:$PATH"
node -v
npm -v

# install yarn
#brew install yarn
npm install -g yarn
yarn -v

npm login --registry=$GEMFURY_URL
npm config set always-auth true
yarn config set always-auth true
yarn install
yarn lint
yarn test
