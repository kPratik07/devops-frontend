pipeline {
    agent any
    environment {
        NEXUS_VERSION = 'nexus3'
        NEXUS_PROTOCOL = 'http'
        NEXUS_URL = '54.173.95.16:8081'
        NEXUS_REPOSITORY = 'my-frontend-repo'
        NEXUS_CREDENTIAL_ID = 'nexus-creds'
        IMAGE_NAME = "my-frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kPratik07/devops-frontend.git'
            }
        }

        // --- SONARQUBE SKIPPED TO FREE UP MEMORY ---
        
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
                sh 'tar -cvf frontend-build.tar . --exclude=".git"'
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
}