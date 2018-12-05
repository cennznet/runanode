#!/bin/bash
# Functional tests

set -ex

# Setup a version endpoint just to demonstrate the service checker script
# Removed this line once Python/Node/NewCoolLanguage tests are added below
curl -v -X PUT "http://${APP_HOSTNAME}:${APP_PORT}/expectation" \
  --silent \
  --header 'Content-Type: text/json; charset=utf-8' \
  -d @- << EOF
{
  "httpRequest" : {
    "path" : "/app/version"
  },
  "httpResponse" : {
    "body" : "0.0.1"
  },
  "times" : {
    "unlimited" : true
  },
  "timeToLive" : {
    "unlimited" : true
  }
}
EOF

./service-checker.sh

echo "**********************************************************************"
echo "* The ${APP_HOSTNAME} container is up and running."
echo "* Put your Python/Node/NewCoolLanguage functional test incantations here."
echo "**********************************************************************"
