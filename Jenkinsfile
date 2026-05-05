pipeline {
    agent any

    environment {
        // Nexus Configuration
        NEXUS_VERSION = 'nexus3'
        NEXUS_PROTOCOL = 'http'
        NEXUS_URL = '54.173.95.16:8081'
        NEXUS_REPOSITORY = 'my-frontend-repo'
        NEXUS_CREDENTIAL_ID = 'nexus-creds'
        
        // Docker Configuration
        IMAGE_NAME = "my-frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kPratik07/devops-frontend.git'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Package for Nexus') {
            steps {
                // Fixed syntax: exclude comes first to avoid self-reference error
                sh 'tar --exclude=".git" --exclude="frontend-build.tar" -cvf frontend-build.tar .'
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    nexusArtifactUploader(
                        nexusVersion: NEXUS_VERSION,
                        protocol: NEXUS_PROTOCOL,
                        nexusUrl: NEXUS_URL,
                        groupId: 'com.frontend',
                        version: '1.0.' + env.BUILD_NUMBER,
                        repository: NEXUS_REPOSITORY,
                        credentialsId: NEXUS_CREDENTIAL_ID,
                        artifacts: [
                            [artifactId: 'frontend-app', classifier: '', file: 'frontend-build.tar', type: 'tar']
                        ]
                    )
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}