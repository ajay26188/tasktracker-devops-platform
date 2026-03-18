# Terraform Infrastructure

This directory contains the Terraform configuration for the AWS infrastructure used by the TaskTracker DevOps Platform.

## Infrastructure Decisions

- Region: us-east-1
- Dev compute: EC2 t3.small
- Initial production compute: EC2 t3.medium
- OS: Amazon Linux 2023 x86_64
- AMI resolution: AWS Systems Manager public parameter
- Access: AWS Systems Manager Session Manager
- SSH: disabled by default
- Deployment model: single public EC2 host with Elastic IP

## Structure

- `environments/dev` - development stack
- `environments/prod` - production stack
- `modules/*` - reusable Terraform modules

## Current modules

- network
- security
- iam
- ecr
- ec2

## Planned next modules

- ssm
- route53

## Usage

Example for dev:

```bash
# go to the dev environment
cd infra/terraform/environments/dev

# create a real tfvars file from the example
cp terraform.tfvars.example terraform.tfvars

# initialize Terraform
terraform init

# format Terraform files
terraform fmt -recursive

# validate configuration
terraform validate

# preview changes
terraform plan

# create infrastructure
terraform apply

# destroy infrastructure when finished
terraform destroy
