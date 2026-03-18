variable "aws_region" {
  type        = string
  description = "AWS region for this environment."
}

variable "project_name" {
  type        = string
  description = "Project name used in naming and tagging."
}

variable "environment" {
  type        = string
  description = "Environment name, e.g. dev or prod."
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC."
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the public subnet."
}

variable "availability_zone" {
  type        = string
  description = "Availability Zone for the public subnet."
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type."
}

variable "ami_ssm_parameter_name" {
  type        = string
  description = "SSM public parameter name for the AMI."
}

variable "enable_ssh_ingress" {
  type        = bool
  description = "Whether to allow inbound SSH."
  default     = false
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH when SSH ingress is enabled."
  default     = ""
}

variable "key_name" {
  type        = string
  description = "Optional EC2 key pair name."
  default     = ""
}