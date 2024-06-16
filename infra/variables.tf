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

variable "hosted_zone_id" {
  type        = string
  description = "hosted zone id where the domain is hosted. This will be used for creating the route53 record"
}
