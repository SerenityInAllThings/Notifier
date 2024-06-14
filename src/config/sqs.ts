import { SQSClient } from '@aws-sdk/client-sqs'
import { getSqsRegion } from './environmentVariables'

export const client = new SQSClient({ region: getSqsRegion() })
