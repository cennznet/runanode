#!/bin/bash

set -ex

rm -rf ./dists
mkdir -p ./dists/logs
cd ./dists
# wget -O launcher-config-win.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-win.yaml
# wget -O launcher-config-mac.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-mac.yaml
# wget -O launcher-config-linux.yaml http://cennz-node-ui.s3.amazonaws.com/launcher-config-linux.yaml

# wget -O cennznet-node-win http://cennz-node-ui.s3.amazonaws.com/cennznet-node-win
# wget -O cennznet-node-mac http://cennz-node-ui.s3.amazonaws.com/cennznet-node-mac
# wget -O cennznet-node-linux http://cennz-node-ui.s3.amazonaws.com/cennznet-node-linux

# chmod -R 777 ./
# cp ./cennznet-node-mac ./cennznet-node





GITHUB_API_TOKEN=34287c23e74cea73ed884e460eaa758914da8e6f
owner=cennznet
repo=cennznet-node-bin
# tag=v$RELEASE_VERSION
name_mac=cennznet-node-mac
name_linux=cennznet-node-linux
name_windows=cennznet-node-win.exe

GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$owner/$repo"
# GH_TAGS="$GH_REPO/releases/tags/$tag"
GH_LATEST_RELEASE="$GH_REPO/releases/latest"
AUTH="Authorization: token $GITHUB_API_TOKEN"

# WGET_ARGS="--content-disposition --auth-no-challenge --no-cookie"
CURL_ARGS="-o $output -LJO#"

# Validate token
curl -o /dev/null -sH "$AUTH" $GH_REPO || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Get latest cennznet assets
response=$(curl -sH "$AUTH" $GH_LATEST_RELEASE)

# Get ID of the asset based on given name.
# eval $(echo "$response" | grep -C3 "name.:.\+$name" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
id_mac=$(echo "$response" | jq --arg name "cennznet-node-mac" '.assets[] | select(.name == "cennznet-node-mac").id')
[ "$id_mac" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_MAC="$GH_REPO/releases/assets/$id_mac"

id_linux=$(echo "$response" | jq --arg name "cennznet-node-linux" '.assets[] | select(.name == "cennznet-node-linux").id')
[ "$id_linux" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_LINUX="$GH_REPO/releases/assets/$id_linux"

id_windows=$(echo "$response" | jq --arg name "cennznet-node-win.exe" '.assets[] | select(.name == "cennznet-node-win.exe").id')
[ "$id_windows" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
ASSET_WINDOWS="$GH_REPO/releases/assets/$id_windows"

# Download asset file.
echo "Downloading asset... to $output" >&2
curl -o cennznet-node-mac -vLJO -H 'Accept: application/octet-stream' "$ASSET_MAC?access_token=$GITHUB_API_TOKEN"
curl -o cennznet-node-linux -vLJO -H 'Accept: application/octet-stream' "$ASSET_LINUX?access_token=$GITHUB_API_TOKEN"
curl -o cennznet-node-wind.exe -vLJO -H 'Accept: application/octet-stream' "$ASSET_WINDOWS?access_token=$GITHUB_API_TOKEN"

chmod -R 777 ./

echo "$0 done." >&2
