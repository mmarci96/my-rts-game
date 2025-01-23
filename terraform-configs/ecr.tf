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

      aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com

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

