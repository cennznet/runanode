#!/bin/bash
set -ex

SERVICE_NAME="cennz-node-ui"
BUILD_NUMBER=1
IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"

# This example uses MockServer on port 1080 adjust the port to suit your application
docker run -it -p 1080:1080 "${IMAGE_NAME}"
