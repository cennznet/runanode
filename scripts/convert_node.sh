#!/bin/bash

# Check dependencies.
set -e
xargs=$(which xargs)

# Validate settings.
[ "$TRACE" ] && set -x
set -x

# echo "Coverting Node for the targeted platform - $OSTYPE " >&2

if [[ "$OSTYPE" == 'linux-gnu' ]]; then
  cp ./dist/cennznet-node-linux ./dist/cennznet-node
elif [[ "$OSTYPE" == 'darwin'* ]]; then
  cp ./dist/cennznet-node-mac ./dist/cennznet-node
elif [[ "$OSTYPE" == 'cygwin' ]]; then
  cp ./dist/cennznet-node-win ./dist/cennznet-node
elif [[ "$OSTYPE" == 'msys' ]]; then
  cp ./dist/cennznet-node-win ./dist/cennznet-node
elif [[ "$OSTYPE" == 'win32' ]]; then
  cp ./dist/cennznet-node-win ./dist/cennznet-node
# elif [[ "$OSTYPE" == 'freebsd'* ]]; then
#   cp ./dist/cennznet-node-linux ./dist/cennznet-node
else
  echo "Error in converting node as $OSTYPE is not detected as our support platform, please report the issue here - https://github.com/cennznet/runanode"
fi
