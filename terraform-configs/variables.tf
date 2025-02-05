
variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "azs" {
  type        = list(string)
  description = "Availability Zones"
  default     = ["eu-north-1a", "eu-north-1b", "eu-north-1c"]
}

variable "ecr_repositories" {
  type        = map(string)
  description = "Map of repository names and their configurations"
  default = {
    "client"        = "client-repository"
    "flask-app"     = "flask-app-repository"
    "game-server"   = "game-server-repository"
  }
}

variable "docker_images" {
  description = "Map of Docker image names to their corresponding directories"
  type = map(object({
    directory       = string
    repository_name = string
  }))
  default = {
    "client" = {
      directory       = "../client"
      repository_name = "client-repository"
    },
    "flask-app" = {
      directory       = "../flask-app"
      repository_name = "flask-app-repository"
    },
    "game-server" = {
      directory       = "../game-server"
      repository_name = "game-server-repository"
    },
  }
}

variable "mongodb-uri-value" {
  description = "Connection URI to MongoDB"
  type        = string
}

variable "secret-key-value" {
  description = "Key encryption"
  type        = string
}

