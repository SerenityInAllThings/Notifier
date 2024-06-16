resource "aws_autoscaling_group" "backend" {
  name                      = "${local.prefix}-asg"
  vpc_zone_identifier       = [for subnet in aws_subnet.public_subnet : subnet.id]
  desired_capacity          = 1
  max_size                  = 1
  min_size                  = 1
  health_check_grace_period = 300
  wait_for_capacity_timeout = "5m"
  target_group_arns         = [aws_lb_target_group.backend.arn]


  launch_template {
    id      = aws_launch_template.backend.id
    version = "$Latest"
  }
}

resource "aws_launch_template" "backend" {
  name                   = "${local.prefix}-launch-template"
  instance_type          = var.instance_type
  image_id               = data.aws_ami.ubuntu.id
  vpc_security_group_ids = [aws_security_group.instance.id]
  user_data = base64encode(
    templatefile(
      "${path.module}/user-data.sh",
      {
        environment   = var.environment
        app_port      = var.webserver_port
        discord_token = var.discord_token
      }
    )
  )
  key_name = var.keypair_name


  block_device_mappings {
    device_name = "/dev/sda1"

    ebs {
      volume_size = 20
    }
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.backend.name
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${local.prefix}-backend-instance"
    }
  }
}

resource "aws_security_group" "instance" {
  name        = "${local.prefix}-instance-sg"
  description = "Allows load balancer https requests to reach the backend and ssh connection"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4_from_lb" {
  security_group_id            = aws_security_group.instance.id
  referenced_security_group_id = aws_security_group.lb-sg.id
  from_port                    = var.webserver_port
  to_port                      = var.webserver_port
  ip_protocol                  = "tcp"

  description = "Allows HTTPS traffic from load balancer to reach application"
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id = aws_security_group.instance.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"

  description = "Allows SSH connection with the instance"
}

resource "aws_vpc_security_group_egress_rule" "allow_egress_all" {
  security_group_id = aws_security_group.instance.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"

  description = "Allows all requests to go out"
}

resource "aws_iam_instance_profile" "backend" {
  name = "${local.prefix}-instance-profile"
  role = aws_iam_role.backend.name
}

resource "aws_iam_role" "backend" {
  name               = "${local.prefix}-iam-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.assume_role_ec2_backend.json
}

data "aws_iam_policy_document" "assume_role_ec2_backend" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "app_permissions" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:*",
      "sqs:*"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "app_permissions" {
  name   = "${local.prefix}-app-permissions-policy"
  path   = "/"
  policy = data.aws_iam_policy_document.app_permissions.json
}

resource "aws_iam_role_policy_attachment" "app_permissions" {
  role       = aws_iam_role.backend.name
  policy_arn = aws_iam_policy.app_permissions.arn
}
