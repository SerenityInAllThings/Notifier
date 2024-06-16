data "aws_route53_zone" "main" {
  zone_id      = var.hosted_zone_id
  private_zone = true
}


resource "aws_route53_record" "backend" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${local.prefix}-ntt.${data.aws_route53_zone.main.name}"
  type    = "CNAME"
  ttl     = 60

  records = [aws_lb.backend.dns_name]

  depends_on = [aws_lb.backend]
}
