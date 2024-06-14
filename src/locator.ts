import { DestinationType } from './domain/destination'
import { Db } from './persistence/db'
import { DynamoDbPersistence } from './persistence/dynamodb'
import { Queue } from './persistence/queue'
import { Sqs } from './persistence/sqs'
import { DestinationHandler } from './services/destinations/destinationHandler'
import { DiscordDestinationHandler } from './services/destinations/discordDestinationHandler'

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

const destinationHandlers: DestinationHandler[] = [new DiscordDestinationHandler()]
export const getDestinationHandler = (destinationType: DestinationType): DestinationHandler => {
  const destination = destinationHandlers.find(handler => handler.destinationType === destinationType)
  if (!destination) throw new Error(`No destination handler found for '${destinationType}'`)
  return destination
}
