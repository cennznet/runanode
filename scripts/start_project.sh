#!/bin/bash
set -ex

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

REPO_NAME="app-skeleton"
PROJECTS_DIR="$(cd ..; pwd)"

function displayError {
    printf "${RED}Project creation failed!${NC}\n"
}

trap displayError ERR

function usage() {
    echo "Usage: start_project.sh <new-project-repo-name>"
    exit 1
}

if [ $# -lt 1 ]
then
    printf "${RED}The directory name of new project repository checkout is required.${NC}\n"
    usage
else
    NEW_PROJECT="${1}"
fi
NEW_PROJECT_ABS_PATH="${PROJECTS_DIR}/${NEW_PROJECT}"

echo "Setting up new project: ${NEW_PROJECT_ABS_PATH}"

if [ ! -d ${PROJECTS_DIR}/${NEW_PROJECT} ]
then
    cat << EOM
The repo ${PROJECTS_DIR}/${NEW_PROJECT} does not exist.
Make sure your new project is already created in Bitbucket and checked out into your projects directory.
For example:

${PROJECTS_DIR}/
├── app-skeleton
└── ${NEW_PROJECT} (new-project)
EOM

    exit 1
fi

echo "* Copying repository skeleton."
FILE_LIST=$(cat << EndOfFileList
build_server_tests
docker
helm
scripts
secrets
settings
docker-compose-ft-localdev.yaml
docker-compose-ft.yaml
docker-compose-ut.yaml
EndOfFileList
)
for path_item in ${FILE_LIST}
do
    cp -Rnv ${PROJECTS_DIR}/${REPO_NAME}/${path_item} ${PROJECTS_DIR}/${NEW_PROJECT}
done

$(type -a git > /dev/null 2>&1) || $(echo "git command not found"; exit 1)

echo "* Add centrality.deploy as submodule"
cd ${PROJECTS_DIR}/${NEW_PROJECT}
pwd
git submodule add git@bitbucket.org:centralitydev/centrality.deploy.git

if [ ! -d ${PROJECTS_DIR}/${NEW_PROJECT}/helm ]
then
    printf "${RED}${PROJECTS_DIR}/${NEW_PROJECT}/helm directory does not exist${NC}\n....exiting\n"
    exit 1
else
    printf "${BLUE}* Add helm templates as submodule${NC}\n"
    cd ${PROJECTS_DIR}/${NEW_PROJECT}/helm
    git submodule add git@bitbucket.org:centralitydev/templates.git
fi

echo "* Copy dev/uat/prod settings"
for environment in {dev,uat,prod}
do
  cp -v ${NEW_PROJECT_ABS_PATH}/settings/appsettings.json ${NEW_PROJECT_ABS_PATH}/settings/${environment}-${NEW_PROJECT}-settings.json
done

function make_from_template {
    TARGET=${1}
    TEMPLATE_FILE=${2}

    NEW_FILE="${NEW_PROJECT_ABS_PATH}/${TARGET}"
    printf "${BLUE}* Creating ${NEW_FILE} ${NC}\n"
    ${PROJECTS_DIR}/${REPO_NAME}/templates/${TEMPLATE_FILE} ${NEW_PROJECT} ${NEW_FILE}
}

make_from_template "JenkinsfilePR" "make_JenkinsfilePR.sh"
make_from_template "Jenkinsfile" "make_Jenkinsfile.sh"
make_from_template "scripts/build-localdev.sh" "make_scripts_build_localdev.sh"
make_from_template "scripts/run-localdev.sh" "make_scripts_run_localdev.sh"
make_from_template "helm/Chart.yaml" "make_helm_Chart.sh"

printf "${GREEN}Project ${NEW_PROJECT_ABS_PATH} has been successfully created.${NC}\n"
