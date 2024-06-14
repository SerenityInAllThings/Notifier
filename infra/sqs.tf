resource "aws_sqs_queue" "notifications-to-send" {
  name                      = "notifications-to-send"
  message_retention_seconds = 1209600
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.notifications-to-send-dlq.arn
    maxReceiveCount     = 4
  })
  visibility_timeout_seconds = 60
}

resource "aws_sqs_queue" "notifications-to-send-dlq" {
  name                      = "notifications-to-send-dlq"
  message_retention_seconds = 1209600
}
