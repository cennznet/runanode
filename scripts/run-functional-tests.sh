#!/bin/bash
# For running Functional Tests in local development environment
# Usage: LOCALDEV=true scripts/run-functional-tests.sh

set -x

# Set build number to 1 if variable is not set
export BUILD_NUMBER=${BUILD_NUMBER:-1}

if [ "${LOCALDEV}" = "true" ]
then
    COMPOSE_FILE="docker-compose-ft-localdev.yaml"
    echo "Remove unwanted file here. Prior to docker build"
else
    COMPOSE_FILE="docker-compose-ft.yaml"
fi

# Get absolute path of docker-compose
$(type -a docker-compose > /dev/null 2>&1) || $(echo "docker-compose not found"; exit 1)
COMPOSE_COMMAND=$(type -a docker-compose | head -1 | cut -d' ' -f3)
echo "${COMPOSE_COMMAND}"

COMPOSE_COMMAND="${COMPOSE_COMMAND} -f ${COMPOSE_FILE}"
echo "${COMPOSE_COMMAND}"

function cleanUp {
    ${COMPOSE_COMMAND} down --remove-orphans
}

set -e

trap cleanUp ERR

${COMPOSE_COMMAND} build
${COMPOSE_COMMAND} down --remove-orphans
${COMPOSE_COMMAND} up -d
${COMPOSE_COMMAND} run --entrypoint=bash ft run-ft.sh
${COMPOSE_COMMAND} down --remove-orphans
