pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm ci'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test -- --coverage=false'
            }
        }

        stage('SAST') {
            steps {
                echo 'Running SAST with Semgrep...'
                bat 'npx semgrep scan --config auto --json --output semgrep-report.json || true'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build -t revoshop:latest .'
            }
        }

    }
}
