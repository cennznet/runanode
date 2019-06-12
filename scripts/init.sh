#!/bin/bash

# Check dependencies.
set -e
xargs=$(which xargs)

# Validate settings.
[ "$TRACE" ] && set -x
set -x

CONFIG=$@

for line in $CONFIG; do
  eval "$line"
done

rm -rf ./dist
mkdir -p ./dist/logs
cd ./dist

wget -O launcher-config-mac.yaml https://github.com/cennznet/runanode/blob/master/launcher-config/launcher-config-mac.yaml
wget -O launcher-config-linux.yaml https://github.com/cennznet/runanode/blob/master/launcher-config/launcher-config-linux.yaml
wget -O launcher-config-win.yaml https://github.com/cennznet/runanode/blob/master/launcher-config/launcher-config-win.yaml


GITHUB_TOKEN=$github_api_token
owner=cennznet
repo=cennznet-node-bin

GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$owner/$repo"
GH_LATEST_RELEASE="$GH_REPO/releases/latest"
AUTH="Authorization: token $GITHUB_TOKEN"

# Validate token
curl -o /dev/null -sH "$AUTH" $GH_REPO || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Get latest cennznet assets
response=$(curl -sH "$AUTH" $GH_LATEST_RELEASE)

id_mac=$(echo "$response" | jq --arg name "cennznet-node-mac" '.assets[] | select(.name == "cennznet-node-mac").id')
[ "$id_mac" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_MAC="$GH_REPO/releases/assets/$id_mac"

id_linux=$(echo "$response" | jq --arg name "cennznet-node-linux" '.assets[] | select(.name == "cennznet-node-linux").id')
[ "$id_linux" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_LINUX="$GH_REPO/releases/assets/$id_linux"

id_windows=$(echo "$response" | jq --arg name "cennznet-node-win.exe" '.assets[] | select(.name == "cennznet-node-win.exe").id')
[ "$id_windows" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_WINDOWS="$GH_REPO/releases/assets/$id_windows"

echo "Downloading asset..." >&2
curl -o cennznet-node-mac -vLJO -H 'Accept: application/octet-stream' "$ASSET_MAC?access_token=$GITHUB_TOKEN"
curl -o cennznet-node-linux -vLJO -H 'Accept: application/octet-stream' "$ASSET_LINUX?access_token=$GITHUB_TOKEN"
curl -o cennznet-node-win.exe -vLJO -H 'Accept: application/octet-stream' "$ASSET_WINDOWS?access_token=$GITHUB_TOKEN"

chmod +x ./cennznet-node*

echo "$0 finished." >&2
