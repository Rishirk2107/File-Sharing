pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository from the specified branch (main branch in this case)
                git branch: 'main', url: 'https://github.com/Rishirk2107/File-Sharing'
            }
        }

        stage('Build and Run Docker Containers') {
            steps {
                script {
                    // Build and start the Docker containers (frontend & backend)
                    bat '''
                    cd $WORKSPACE
                    docker-compose -f docker-compose.yml up --build -d
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                // Optional: Uncomment the below line if you want to stop the containers after the build
                // bat '''
                // cd $WORKSPACE
                // docker-compose -f docker-compose.yml down
                // '''
                echo "Build running"
            }
        }

        failure {
            // Handle any failure notifications or cleanup
            echo 'The build failed! Check the logs for more details.'
        }
    }
}
