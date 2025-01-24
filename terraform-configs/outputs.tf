# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "region" {
  description = "AWS region"
  value       = var.region
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "repositories" {
  description = "Repository Names"
  value       = var.ecr_repositories
}

output "ecr_repository_urls" {
  value       = { for repo, details in aws_ecr_repository.repositories : repo => details.repository_url }
  description = "The URLs of the ECR repositories."
}

output "rts_game_client_external_ip" {
  value       = kubernetes_service.rts_game_client.status[0].load_balancer[0].ingress[0].hostname
  description = "External IP for the RTS Game Client service"
}


