# Architecture

## Overview

TaskTracker DevOps Platform is a cloud deployment of the TaskTracker full-stack application on AWS.

The application runs on a single AWS EC2 instance and uses:

- Docker for container images
- Amazon ECR for image storage
- k3s for Kubernetes orchestration
- Traefik Ingress for routing
- Jenkins for CI/CD automation
- MongoDB Atlas as the external database

## Final Deployment Architecture

```text
Internet
  |
  v
EC2 Public / Elastic IP
  |
  v
k3s Kubernetes Cluster
  |
  v
Traefik Ingress
  |---- /          -> tasktracker-client service -> tasktracker-client pod
  |---- /api       -> tasktracker-server service -> tasktracker-server pod
  |---- /socket.io -> tasktracker-server service -> tasktracker-server pod
                                               |
                                               v
                                          MongoDB Atlas