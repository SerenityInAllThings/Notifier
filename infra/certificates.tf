data "aws_acm_certificate" "domain-certificate" {
  domain      = var.certificate_domain_name
  most_recent = true
}
