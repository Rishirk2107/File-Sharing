pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        // Pull the latest code from the repository
        git 'https://github.com/Rishirk2107/File-Sharing.git'
      }
    }
    stage('Build Docker Images') {
      steps {
        // Build Docker images using Docker Compose
        script {
          bat 'docker-compose -f docker-compose.yml build'
        }
      }
    }
    stage('Run Docker Containers') {
      steps {
        // Run Docker containers using Docker Compose
        script {
          bat 'docker-compose -f docker-compose.yml up -d'
        }
      }
    }
  }
  post {
    always {
      // Cleanup Docker containers after the build
      script {
        bat 'docker-compose -f docker-compose.yml down'
      }
    }
  }
}
