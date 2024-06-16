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

variable "webserver_port" {
  type        = number
  description = "Port to expose the webserver on"
  default     = 3000
}

variable "hosted_zone_id" {
  type        = string
  description = "hosted zone id where the domain is hosted. This will be used for creating the route53 record"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnets_cidr" {
  type        = list(string)
  description = "values for the public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets_cidr" {
  type        = list(string)
  description = "values for the private subnets"
  default     = ["10.0.10.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "values for the availability zones"
  default     = ["sa-east-1a", "sa-east-1c"]
}

variable "certificate_domain_name" {
  type        = string
  description = "Certificate domain name to be used for the load balancer address. This certificate needs to be in north virginia (us-east-1) region"
}

variable "instance_type" {
  type        = string
  description = "instance type for the backend"
  default     = "t3.micro"
}

variable "keypair_name" {
  type        = string
  description = "keypair name for the backend"
}

variable "discord_token" {
  type        = string
  description = "discord token to be used for authentication with discord"
}
