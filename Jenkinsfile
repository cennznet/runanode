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
        AWS_ACCESS_KEY  = credentials('TF_AWS_ACCESS_KEY')
        AWS_SECRET_KEY = credentials('TF_AWS_SECRET_KEY')
        NAMESPACE = 'cennz-node-ui'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh './scripts/build.sh'
            }
        }

        // stage('Unit Tests') {
        //     steps {
        //         sh './scripts/run-unit-tests.sh'
        //     }
        // }

        // stage('Functional Tests') {
        //     steps {
        //         sh './scripts/run-functional-tests.sh'
        //     }
        // }

        stage('Publish Image') {
            environment {
                ACR = credentials('AzureDockerRegistry')
            }
            steps {
                sh './centrality.deploy/publish.sh'
            }
        }

        stage('Dev Deploy') {
            environment {
                ENV = 'dev'
                AWS_CLUSTER_NAME = credentials('DEV_AWS_CLUSTER_NAME')
                AWS_CLUSTER_URL = credentials('DEV_AWS_CLUSTER_URL')
                JENKINS_AWS_K8S_CERTIFICATE = credentials('DEV_JENKINS_AWS_K8S_CERTIFICATE')
                JENKINS_AWS_K8S_KEY = credentials('DEV_JENKINS_AWS_K8S_KEY')
                JENKINS_AWS_K8S_CA = credentials('DEV_JENKINS_AWS_K8S_CA')
            }
            steps {
                echo "Run Helm config-apply.sh"
                sh 'SCRIPT="config" ./centrality.deploy/aws/helm/deploy.sh'

                echo "Run Helm helm-apply.sh"
                sh './centrality.deploy/aws/helm/deploy.sh'
            }
        }

        // stage ('Confirm UAT deploy') {
        //     steps {
        //         timeout(time:10, unit:'MINUTES') {
        //             input "Confirm UAT deploy?"
        //         }
        //     }
        //     post {
        //         aborted {
        //             echo "UAT Deploy aborted"
        //             sh 'bash /mnt/jenkins/script/cleanup.sh'
        //         }
        //     }
        // }

        stage('UAT Deploy') {
            environment {
                ENV = 'uat'
                AWS_CLUSTER_NAME = credentials('UAT_AWS_CLUSTER_NAME')
                AWS_CLUSTER_URL = credentials('UAT_AWS_CLUSTER_URL')
                JENKINS_AWS_K8S_CERTIFICATE = credentials('UAT_JENKINS_AWS_K8S_CERTIFICATE')
                JENKINS_AWS_K8S_KEY = credentials('UAT_JENKINS_AWS_K8S_KEY')
                JENKINS_AWS_K8S_CA = credentials('UAT_JENKINS_AWS_K8S_CA')
            }
            steps {
                echo "Run helm config-apply.sh"
                sh 'SCRIPT="config" ./centrality.deploy/aws/helm/deploy.sh'

                echo "Run helm helm-apply.sh"
                sh './centrality.deploy/aws/helm/deploy.sh'
            }
        }

        // stage ('Confirm Prod deploy') {
        //     steps {
        //         timeout(time:10, unit:'MINUTES') {
        //             input "Confirm Prod deploy?"
        //         }
        //     }
        //     post {
        //         aborted {
        //             echo "UAT Deploy aborted"
        //             sh 'bash /mnt/jenkins/script/cleanup.sh'
        //         }
        //     }
        // }

        // stage('Prod - Deploy Docker Image') {
        //     environment {
        //         ENV = 'prod'
        //         AWS_CLUSTER_NAME = credentials('PROD_AWS_CLUSTER_NAME')
        //         AWS_CLUSTER_URL = credentials('PROD_AWS_CLUSTER_URL')
        //         JENKINS_AWS_K8S_CERTIFICATE = credentials('PROD_JENKINS_AWS_K8S_CERTIFICATE')
        //         JENKINS_AWS_K8S_KEY = credentials('PROD_JENKINS_AWS_K8S_KEY')
        //         JENKINS_AWS_K8S_CA = credentials('PROD_JENKINS_AWS_K8S_CA')
        //     }
        //     steps {
        //         echo "Run helm config-apply.sh"
        //         sh 'SCRIPT="config" ./centrality.deploy/aws/helm/deploy.sh'

        //         echo "Run helm helm-apply.sh"
        //         sh './centrality.deploy/aws/helm/deploy.sh'
        //     }
        // }
    }

    post {
        always {
            echo "Pipeline post always"
            sh 'bash /mnt/jenkins/script/cleanup.sh'
        }
    }
}
