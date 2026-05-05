pipeline {
    agent any

    tools {
        // Must match the name in Manage Jenkins -> Global Tool Configuration
        nodejs 'node' 
    }

    environment {
        // Must match the names in Manage Jenkins -> Global Tool Configuration / System
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
                // Pulls code from your GitHub repository
                git branch: 'main', url: 'https://github.com/kPratik07/devops-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installs the npm packages required for your project
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Links to your SonarQube server for code quality checks
                withSonarQubeEnv('sonar-server') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=frontend-app -Dsonar.sources=."
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Builds the Docker image using the Dockerfile you added
                    sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Package for Nexus') {
            steps {
                // Creates a zip file of the source code (excluding node_modules) for storage
                sh 'zip -r frontend-build.zip . -x "node_modules/*" ".git/*"'
            }
        }

        stage('Upload to Nexus') {
            steps {
                script {
                    // Uploads the artifact to your 'my-frontend-repo' in Nexus
                    nexusArtifactUploader(
                        nexusVersion: NEXUS_VERSION,
                        protocol: NEXUS_PROTOCOL,
                        nexusUrl: NEXUS_URL,
                        groupId: 'com.frontend',
                        version: '1.0.' + env.BUILD_NUMBER,
                        repository: NEXUS_REPOSITORY,
                        credentialsId: NEXUS_CREDENTIAL_ID,
                        artifacts: [
                            [artifactId: 'frontend-app', classifier: '', file: 'frontend-build.zip', type: 'zip']
                        ]
                    )
                }
            }
        }
    }

    post {
        always {
            // Clean up the workspace to save disk space on your EC2 instance
            cleanWs()
        }
    }
}