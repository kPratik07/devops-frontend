pipeline {
    agent any

    environment {
        // Tool names must match exactly what you configured in 'Global Tool Configuration'
        SCANNER_HOME = tool 'sonar-scanner'
        
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
                // Pulls the latest code from your main branch
                git branch: 'main', url: 'https://github.com/kPratik07/devops-frontend.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Ensure SonarQube container is RUNNING before this stage starts
                withSonarQubeEnv('sonar-server') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=frontend-app -Dsonar.sources=."
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Builds the image using the Dockerfile in your repo
                    sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Package for Nexus') {
            steps {
                // Using 'tar' instead of 'zip' to avoid "zip: command not found" errors
                sh 'tar -cvf frontend-build.tar . --exclude=".git"'
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    // Ensure Nexus container is RUNNING before this stage starts
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
            // Cleans the workspace to save disk space on your EC2 instance
            cleanWs()
        }
    }
}