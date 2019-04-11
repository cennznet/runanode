#!/bin/bash

# https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1560#issuecomment-439576398
echo "Uploading source maps to Sentry"

#source env.internal
echo "SENTRY_ORG: $SENTRY_ORG"
export SENTRY_ORG=centrality-ai
echo "SENTRY_AUTH_TOKEN: $SENTRY_AUTH_TOKEN"
export SENTRY_AUTH_TOKEN=fa4017b1975c4defb9951c7f978ef02e6251e43679a34ea193d867c24b46dc15

#source env.production
echo "SENTRY_PROJECT: $SENTRY_PROJECT"
export SENTRY_PROJECT=cenznet-node-ui

export GIT_HASH=`git rev-parse HEAD`
echo "GIT_HASH: $GIT_HASH"

# https://gist.github.com/DarrenN/8c6a5b969481725a4413#gistcomment-1678696
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Package version: $PACKAGE_VERSION"

echo "Uploading..."
./node_modules/.bin/sentry-cli releases files $PACKAGE_VERSION-$GIT_HASH upload-sourcemaps app/dist --url-prefix './app/dist/'
echo "Done uploading sourcemaps"
