#!/bin/bash

# Check dependencies.
set -e
xargs=$(which xargs)

# Validate settings.
[ "$TRACE" ] && set -x
set -x

# Ensure args be passed into the script
CONFIG=$@

for line in $CONFIG; do
  eval "$line"
done

# Clear before starting jobs
rm -rf ./dist
mkdir -p ./dist/logs

# Copy launcher configs into dist folder for Electron-builder packing
cp ./launcher-config/launcher-config-linux.yaml ./dist/launcher-config-linux.yaml
cp ./launcher-config/launcher-config-mac.yaml ./dist/launcher-config-mac.yaml
cp ./launcher-config/launcher-config-win.yaml ./dist/launcher-config-win.yaml

# Grab cennznet-node file via Github API
owner=cennznet
repo=cennznet-node-bin

GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$owner/$repo"
GH_LATEST_RELEASE="$GH_REPO/releases/latest"

# Get latest cennznet assets
response=$(curl $GH_LATEST_RELEASE)

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
curl -o ./dist/cennznet-node-mac -vLJO -H 'Accept: application/octet-stream' "$ASSET_MAC"
curl -o ./dist/cennznet-node-linux -vLJO -H 'Accept: application/octet-stream' "$ASSET_LINUX"
curl -o ./dist/cennznet-node-win.exe -vLJO -H 'Accept: application/octet-stream' "$ASSET_WINDOWS"

chmod +x ./dist/cennznet-node*
