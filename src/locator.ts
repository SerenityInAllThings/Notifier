import { Db } from './persistence/db'
import { DynamoDbPersistence } from './persistence/dynamodb'

const services: {
  persistence: Db | undefined
} = {
  persistence: undefined,
}

export const getPersistence = (): Db => {
  if (!services.persistence) services.persistence = new DynamoDbPersistence()
  return services.persistence
}
