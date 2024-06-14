import { Db } from './persistence/db'
import { DynamoDbPersistence } from './persistence/dynamodb'
import { Queue } from './persistence/queue'
import { Sqs } from './persistence/sqs'

const services: {
  persistence: Db | undefined
  queue: Queue | undefined
} = {
  persistence: undefined,
  queue: undefined,
}

export const getPersistence = (): Db => {
  if (!services.persistence) services.persistence = new DynamoDbPersistence()
  return services.persistence
}

export const getQueue = (): Queue => {
  if (!services.queue) services.queue = new Sqs()
  return services.queue
}
