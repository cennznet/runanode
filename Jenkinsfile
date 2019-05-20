#!groovy
pipeline {
  agent {
    label 'linux'
  }

  options {
    ansiColor('xterm')
  }

  environment {
    SERVICE_NAME = 'cennz-node-ui'
    AWS_ACCESS_KEY = credentials('TF_AWS_ACCESS_KEY')
    AWS_SECRET_KEY = credentials('TF_AWS_SECRET_KEY')
    NAMESPACE = 'cennz-node-ui'
    SSH_RSA_FILE_PATH = credentials('jenkins-ssh-key')
    GEMFURY_TOKEN = credentials('GEMFURY_TOKEN')
    GEMFURY_URL = credentials('GEMFURY_EXTERNAL_URL')
  }

  stages {
    stage('Test') {
      steps {
        sh './scripts/test.sh'
      }
    }
  }
}
