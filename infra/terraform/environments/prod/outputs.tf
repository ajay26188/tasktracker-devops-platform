output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_id" {
  value = module.network.public_subnet_id
}

output "ec2_instance_id" {
  value = module.ec2.instance_id
}

output "ec2_private_ip" {
  value = module.ec2.private_ip
}

output "elastic_ip" {
  value = module.ec2.elastic_ip
}

output "client_ecr_repository_url" {
  value = module.ecr.client_repository_url
}

output "server_ecr_repository_url" {
  value = module.ecr.server_repository_url
}