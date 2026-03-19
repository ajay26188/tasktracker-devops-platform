# TaskTracker DevOps Platform

Production-style cloud deployment of the TaskTracker full-stack application using AWS, Docker, Kubernetes (k3s), Terraform, Jenkins, and MongoDB Atlas.

## Overview

This repository focuses on the cloud-native deployment and DevOps modernization of **TaskTracker**, a full-stack team task management application originally built with:

- React + TypeScript
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.IO

The goal of this repository is to redeploy the project using a more production-oriented architecture that demonstrates:

- containerization with Docker
- multi-service local testing with Docker Compose
- infrastructure as code with Terraform
- Kubernetes-based deployment
- CI/CD automation with Jenkins
- AWS-based cloud hosting

## Why this repository exists

The original TaskTracker application was deployed using Vercel and Render.  
This repository is a recruiter-friendly DevOps/platform version of the same project, created to demonstrate practical cloud engineering and deployment skills on top of a real full-stack application.

It is designed to show that the project can move from a standard student/full-stack deployment into a more production-style environment using modern infrastructure and automation tools.

## Current Status

### Completed so far

#### Ticket 1 — Deployment readiness
- standardized environment variable approach
- added `.env.example` templates
- improved backend production readiness
- added configurable `ALLOWED_ORIGINS` for CORS and Socket.IO
- added `/health` endpoint
- prepared Docker-related ignore files

#### Ticket 2 — Containerization
- containerized backend with Docker
- containerized frontend with Docker
- configured frontend to be served via Nginx
- added Docker Compose for local multi-container testing
- verified local container setup:
  - frontend works on `http://localhost:8080`
  - backend health endpoint works on `http://localhost:3000/health`

## Ticket 3 — Terraform Infrastructure Planning

This stage introduces the AWS infrastructure design and Terraform project structure for the cloud deployment of TaskTracker.

### Planned AWS resources
- VPC with a public subnet
- Internet Gateway and routing
- Security group for web traffic
- EC2 instance for running the application platform
- Elastic IP for stable public access
- IAM role and instance profile
- Amazon ECR repositories for frontend and backend images
- AWS Systems Manager Parameter Store for configuration
- Route 53 records for domain routing (planned)

### Terraform approach
The infrastructure is organized using reusable Terraform modules and environment-specific stacks. The initial state management approach uses local Terraform state, with a later plan to migrate to a remote backend.

## Ticket 4 — EC2 Bootstrap

This stage adds first-boot instance bootstrap using EC2 user data.

### What is configured
- Docker is installed automatically on Amazon Linux 2023
- Docker service is enabled and started
- Base application directory `/opt/tasktracker` is created
- Instance remains managed through AWS Systems Manager Session Manager

### Why this matters
This turns the EC2 instance from raw infrastructure into a reusable application host that is ready for container deployment in later tickets.

## Ticket 5A — Single-host Docker deployment on EC2

This stage deploys TaskTracker publicly on a single EC2 host using Docker and Docker Compose.

### Deployment model
- frontend served by Nginx container on port 80
- frontend Nginx proxies `/api` and `/socket.io` traffic to the backend container
- backend connects to MongoDB Atlas
- Docker images are stored in Amazon ECR
- EC2 host is accessed through AWS Systems Manager Session Manager

### Why this stage exists
This provides a real public deployment before introducing Kubernetes, making the architecture easier to verify and incrementally improve.

## Current Architecture

At the current stage, the application runs in a hybrid local-container setup:

- **client** runs in a Docker container
- **server** runs in a Docker container
- **database** remains external via `MONGODB_URI` (MongoDB Atlas / remote MongoDB)

### Flow

Users → Nginx frontend container → backend container → MongoDB database

This allows the frontend and backend to be tested in production-like containers while keeping the database managed externally.

## Tech Stack

### Application
- React
- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO

### DevOps / Cloud
- Docker
- Docker Compose
- Nginx
- AWS
- Kubernetes (planned: k3s on EC2)
- Terraform
- Jenkins

## Local Container Testing

### Services
- **Frontend:** served by Nginx container on port `8080`
- **Backend:** Node.js container on port `3000`

### Run locally

```bash
docker compose build
docker compose up