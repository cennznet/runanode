#!/bin/bash

set -ex

timeCounter=0
timeLimit=30

URL="http://${APP_HOSTNAME}:${APP_PORT}/${SERVICE_CHECK_URL_PATH}"

while [[ $(curl "${URL}" --write-out %{http_code} --silent --output healtcheck.result) -ne 200 && $timeCounter -ne $timeLimit ]]
do
    echo "Wait for app health check"
    let timeCounter+=1
    sleep 1
done

if [ $timeCounter -eq $timeLimit ]
then
    exit 1
fi
