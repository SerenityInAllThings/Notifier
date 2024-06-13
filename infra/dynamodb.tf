resource "aws_dynamodb_table" "notifications-to-be-sent" {
  name         = "notifications-to-be-sent"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "sent-notifications" {
  name         = "sent-notifications"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "sentDate"

  attribute {
    name = "sentDate"
    type = "S"
  }
}

resource "aws_dynamodb_table" "destinations" {
  name         = "destinations"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
