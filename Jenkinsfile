pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Pull code from your GitHub repository
                git 'https://github.com/Rishirk2107/File-Sharing'
            }
        }

        stage('Build and Run Docker Containers') {
            steps {
                script {
                    // Build and start containers using Docker Compose
                    bat 'docker-compose -f docker-compose.yml up --build -d'
                }
            }
        }
    }

    post {
        always {
            // Stop and remove containers after build completes
            bat 'docker-compose -f docker-compose.yml down'
        }
    }
}
