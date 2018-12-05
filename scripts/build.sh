#!/bin/bash

set -ex

: "${SERVICE_NAME:?SERVICE_NAME is required}"
: "${BUILD_NUMBER:?BUILD_NUMBER is required}"

IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"

docker build -t "${IMAGE_NAME}" \
  -f docker/build/Dockerfile .
