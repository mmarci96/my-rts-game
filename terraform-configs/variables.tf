
variable "region" {
  description = "AWS region"
  type        = string
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"
}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"
}

variable "ecr_repositories" {
  type        = map(string)
  description = "Map of repository names and their configurations"
}

variable "docker_images" {
  description = "Map of Docker image names to their corresponding directories"
  type = map(object({
    directory       = string
    repository_name = string
  }))
}

variable "mongodb-uri-value" {
  description = "Storing the value of the connection url"
  type        = string
}
variable "secret-key-value" {
  description = "For hasing pws"
  type        = string
}

