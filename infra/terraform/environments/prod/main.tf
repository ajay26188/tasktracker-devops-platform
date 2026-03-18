data "aws_ssm_parameter" "ami" {
  name = var.ami_ssm_parameter_name
}

module "network" {
  source = "../../modules/network"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  public_subnet_cidr = var.public_subnet_cidr
  availability_zone  = var.availability_zone
}

module "security" {
  source = "../../modules/security"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.network.vpc_id
  enable_ssh_ingress = var.enable_ssh_ingress
  allowed_ssh_cidr   = var.allowed_ssh_cidr
}

module "iam" {
  source = "../../modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

module "ec2" {
  source = "../../modules/ec2"

  project_name          = var.project_name
  environment           = var.environment
  ami_id                = data.aws_ssm_parameter.ami.value
  instance_type         = var.instance_type
  subnet_id             = module.network.public_subnet_id
  security_group_id     = module.security.ec2_security_group_id
  instance_profile_name = module.iam.instance_profile_name
  key_name              = var.key_name

  user_data = templatefile("${path.root}/../../templates/user-data.sh.tftpl", {})
}