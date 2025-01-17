
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "my-game-cluster"
  cluster_version = "1.31"
  vpc_id          = aws_vpc.main.id

  tags = {
    Name = "my-game-eks-cluster"
  }
}
