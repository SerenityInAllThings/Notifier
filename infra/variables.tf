variable "environment" {
  type        = string
  description = "Name to identify the environment"
}

variable "region" {
  type        = string
  description = "AWS region to deploy to"
}

variable "profile" {
  type        = string
  description = "AWS CLI profile to use"
}
