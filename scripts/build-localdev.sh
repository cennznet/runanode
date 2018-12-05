#!/bin/bash
set -ex

SERVICE_NAME="cennz-node-ui"
BUILD_NUMBER=1
IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"

docker build -t "${IMAGE_NAME}" -f docker/localdev/Dockerfile .
