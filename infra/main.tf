
terraform {
  backend "s3" {}
}

provider "aws" {
  region  = var.region
  profile = var.profile
}
