pipeline {
  agent none
  stages {
    stage('Build') {
  agent {
    docker {
      image 'node:10'
      args '-p 3000:3000 -u 0'
    }
  }
      steps {
        sh 'npm install'
        sh 'echo hello world'
        sh 'echo hello Jenkins'
      }
    }
}
  environment {
    HOME = '.'
  }
}
