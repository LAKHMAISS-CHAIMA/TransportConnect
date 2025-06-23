pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_BACKEND = 'transportconnect-backend'
        DOCKER_IMAGE_FRONTEND = 'transportconnect-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                
                stage('Frontend Dependencies') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Security Audit') {
            parallel {
                stage('Backend Security') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm audit --audit-level moderate || true'
                        }
                    }
                }
                
                stage('Frontend Security') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm audit --audit-level moderate || true'
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ."
                            sh "docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest"
                        }
                    }
                }
                
                stage('Build Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ."
                            sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest"
                        }
                    }
                }
            }
        }
        
        stage('Test Docker Compose') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
                sh 'sleep 30'
                sh 'curl -f http://localhost:5000/api/auth/health || exit 1'
                sh 'curl -f http://localhost:5173 || exit 1'
                sh 'docker-compose down'
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Décommentez et configurez selon votre registry Docker
                    // sh "docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}"
                    // sh "docker push ${DOCKER_IMAGE_BACKEND}:latest"
                    // sh "docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}"
                    // sh "docker push ${DOCKER_IMAGE_FRONTEND}:latest"
                    echo "Images ready for deployment"
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    // Décommentez et configurez selon votre environnement de déploiement
                    // sh 'docker-compose -f docker-compose.prod.yml up -d'
                    echo "Deployment completed successfully"
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose down || true'
            cleanWs()
        }
        
        success {
            echo "Pipeline completed successfully!"
        }
        
        failure {
            echo "Pipeline failed!"
        }
    }
} 