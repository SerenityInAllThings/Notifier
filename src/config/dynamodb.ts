import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { getDynamoDbRegion } from './environmentVariables'

export const client = new DynamoDBClient({ region: getDynamoDbRegion() })
