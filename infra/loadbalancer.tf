resource "aws_lb" "backend" {
  name               = "${local.prefix}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb-sg.id]
  subnets            = [for subnet in aws_subnet.public_subnet : subnet.id]
}

resource "aws_security_group" "lb-sg" {
  name        = "${local.prefix}-lb-sg"
  description = "Allows public https requests to reach the backend"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
  security_group_id = aws_security_group.lb-sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"

  description = "Allow TLS traffic from the internet"
}

resource "aws_vpc_security_group_egress_rule" "allow_egress_all_lb" {
  security_group_id = aws_security_group.lb-sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"

  description = "Allows all requests to go out"
}

resource "aws_lb_target_group" "backend" {
  name        = "${local.prefix}-alb-tg"
  target_type = "instance"
  port        = var.webserver_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.backend.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = data.aws_acm_certificate.domain-certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
