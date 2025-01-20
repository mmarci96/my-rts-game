provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}
data "aws_caller_identity" "current" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.17.0"

  name = "rts-game-vpc"
  cidr = "10.0.0.0/16"

  azs             = var.azs
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
  map_public_ip_on_launch = true
}

locals {
  vpc_id              = module.vpc.vpc_id
  vpc_cidr            = module.vpc.vpc_cidr_block
  public_subnets_ids  = module.vpc.public_subnets
  private_subnets_ids = module.vpc.private_subnets
  subnets_ids         = concat(local.public_subnets_ids, local.private_subnets_ids)
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.33.0"

  cluster_name    = "rts-game-cluster"
  cluster_version = "1.31"

  cluster_endpoint_public_access           = true
  enable_cluster_creator_admin_permissions = true

  cluster_addons = {
    aws-ebs-csi-driver = {
      service_account_role_arn = module.irsa-ebs-csi.iam_role_arn
    }
  }

  vpc_id                   = local.vpc_id
  subnet_ids               = local.private_subnets_ids
  control_plane_subnet_ids = local.private_subnets_ids

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"
  }

  eks_managed_node_groups = {
    one = {
      name = "node-group-1"

      instance_types = ["t3.small"]

      min_size     = 1
      max_size     = 3
      desired_size = 2
    }

    two = {
      name = "node-group-2"

      instance_types = ["t3.medium"]

      min_size     = 1
      max_size     = 4
      desired_size = 1
    }
  }

}


# https://aws.amazon.com/blogs/containers/amazon-ebs-csi-driver-is-now-generally-available-in-amazon-eks-add-ons/ 
data "aws_iam_policy" "ebs_csi_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

module "irsa-ebs-csi" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version = "5.39.0"

  create_role                   = true
  role_name                     = "AmazonEKSTFEBSCSIRole-${module.eks.cluster_name}"
  provider_url                  = module.eks.oidc_provider
  role_policy_arns              = [data.aws_iam_policy.ebs_csi_policy.arn]
  oidc_fully_qualified_subjects = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
}


resource "aws_ecr_repository" "repositories" {
  for_each     = var.docker_images
  name         = each.value.repository_name
  force_delete = true

  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = "Production"
    Team        = "DevOps"
  }
}


resource "null_resource" "docker_build_and_push" {
  for_each = var.docker_images

  provisioner "local-exec" {
    command = <<EOT
      # Change to the project directory
      cd ${each.value.directory}

      aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.us-east-1.amazonaws.com

      docker build -t ${each.value.repository_name}:latest .

      docker tag ${each.value.repository_name}:latest ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${each.value.repository_name}:latest

      docker push ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${each.value.repository_name}:latest
    EOT
  }

  depends_on = [aws_ecr_repository.repositories]
}

resource "aws_ecr_repository_policy" "access_policy" {
  for_each = aws_ecr_repository.repositories

  repository = each.value.name

  policy = <<EOF
  {
  "Version": "2012-10-17",
  "Statement": [
  {
  "Sid": "AllowCrossAccountPull",
  "Effect": "Allow",
  "Principal": {
  "AWS": "arn:aws:iam::390403884602:user/sarosdimarci@gmail.com"
  },
  "Action": [
  "ecr:GetDownloadUrlForLayer",
  "ecr:BatchGetImage",
  "ecr:BatchCheckLayerAvailability"
  ]
  }
  ]
  }
  EOF
}

resource "aws_ecr_lifecycle_policy" "destroy_policy" {
  for_each = aws_ecr_repository.repositories

  repository = each.value.name

  policy = <<EOF
  {
  "rules": [
  {
  "rulePriority": 1,
  "description": "Expire untagged images after 30 days",
  "selection": {
  "tagStatus": "untagged",
  "countType": "imageCountMoreThan",
  "countNumber": 100
  },
  "action": {
  "type": "expire"
  }
  }
  ]
  }
  EOF
}

