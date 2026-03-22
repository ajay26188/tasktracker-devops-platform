pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    AWS_REGION   = 'us-east-1'
    AWS_ACCOUNT  = '383349724158'
    ECR_REGISTRY = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    SERVER_REPO  = 'tasktracker-dev-server'
    CLIENT_REPO  = 'tasktracker-dev-client'
    KUBECONFIG   = '/var/lib/jenkins/.kube/config'
    NAMESPACE    = 'tasktracker'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Metadata') {
      steps {
        script {
          env.SHORT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.SHORT_SHA}"
        }
      }
    }

    stage('Verify Tools') {
      steps {
        sh '''
          docker --version
          docker compose version
          aws --version
          kubectl version --client
          kubectl get nodes
        '''
      }
    }

    stage('Ensure Namespace') {
      steps {
        sh '''
          kubectl apply -f infra/kubernetes/namespace.yaml
        '''
      }
    }

    stage('Ensure ECR Pull Secret') {
      steps {
        sh '''
          kubectl create secret docker-registry ecr-regcred \
            --docker-server="$ECR_REGISTRY" \
            --docker-username=AWS \
            --docker-password="$(aws ecr get-login-password --region "$AWS_REGION")" \
            -n "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
        '''
      }
    }

    stage('Ensure App Secret') {
      steps {
        withCredentials([
          string(credentialsId: 'tasktracker-mongodb-uri', variable: 'MONGODB_URI'),
          string(credentialsId: 'tasktracker-secret', variable: 'SECRET'),
          string(credentialsId: 'tasktracker-email-from', variable: 'EMAIL_FROM'),
          string(credentialsId: 'tasktracker-email-secret', variable: 'EMAIL_SECRET'),
          string(credentialsId: 'tasktracker-brevo-api-key', variable: 'BREVO_API_KEY')
        ]) {
          sh '''
            kubectl create secret generic tasktracker-server-secrets \
              --from-literal=MONGODB_URI="$MONGODB_URI" \
              --from-literal=SECRET="$SECRET" \
              --from-literal=EMAIL_FROM="$EMAIL_FROM" \
              --from-literal=EMAIL_SECRET="$EMAIL_SECRET" \
              --from-literal=BREVO_API_KEY="$BREVO_API_KEY" \
              -n "$NAMESPACE" \
              --dry-run=client -o yaml | kubectl apply -f -
          '''
        }
      }
    }

    stage('Apply Base Manifests') {
      steps {
        sh '''
          kubectl apply -f infra/kubernetes/server-service.yaml
          kubectl apply -f infra/kubernetes/client-service.yaml
          kubectl apply -f infra/kubernetes/server-deployment.yaml
          kubectl apply -f infra/kubernetes/client-deployment.yaml
          kubectl apply -f infra/kubernetes/ingress.yaml
        '''
      }
    }

    stage('Login to ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region "$AWS_REGION" \
          | docker login --username AWS --password-stdin "$ECR_REGISTRY"
        '''
      }
    }

    stage('Build and Push Server') {
      steps {
        sh '''
          docker buildx build \
            --platform linux/amd64 \
            -t "$ECR_REGISTRY/$SERVER_REPO:$IMAGE_TAG" \
            -t "$ECR_REGISTRY/$SERVER_REPO:latest" \
            --push \
            ./server
        '''
      }
    }

    stage('Build and Push Client') {
      steps {
        sh '''
          docker buildx build \
            --platform linux/amd64 \
            --build-arg VITE_API_URL=/api \
            -t "$ECR_REGISTRY/$CLIENT_REPO:$IMAGE_TAG" \
            -t "$ECR_REGISTRY/$CLIENT_REPO:latest" \
            --push \
            ./client
        '''
      }
    }

    stage('Deploy to k3s') {
      steps {
        sh '''
          kubectl -n "$NAMESPACE" set image deployment/tasktracker-server \
            server="$ECR_REGISTRY/$SERVER_REPO:$IMAGE_TAG"

          kubectl -n "$NAMESPACE" set image deployment/tasktracker-client \
            client="$ECR_REGISTRY/$CLIENT_REPO:$IMAGE_TAG"

          kubectl -n "$NAMESPACE" rollout status deployment/tasktracker-server --timeout=180s
          kubectl -n "$NAMESPACE" rollout status deployment/tasktracker-client --timeout=180s
        '''
      }
    }
  }

  post {
    success {
      echo 'Deployment completed successfully.'
    }
    failure {
      sh '''
        kubectl get pods -n "$NAMESPACE" || true
        kubectl get deployments -n "$NAMESPACE" || true
        kubectl get ingress -n "$NAMESPACE" || true
      '''
    }
  }
}