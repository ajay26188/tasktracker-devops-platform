variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "enable_ssh_ingress" {
  type    = bool
  default = false
}

variable "allowed_ssh_cidr" {
  type    = string
  default = ""
}