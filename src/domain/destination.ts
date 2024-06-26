import { hasStringLiteralProperty, hasStringProperty, hasStringToStringMapProperty, isObject } from './typeguards'
import { Notification } from './notification'

export type Destination = {
  id: string
  name: string
  type: DestinationType
  /** Map of tags to values that must be present in the notification
   * if '*' is used as value, it means that the tag must be present in the notification
   */
  requiredTags: Record<string, string>
}

export const destinationTypes = ['discord'] as const
export type DestinationType = (typeof destinationTypes)[number]

export type SentNotification = Notification & {
  /** YYYY-MM-DD, using notification.ts getSentDate function */
  sentDate: string
  destinationName: string
  destinationType: DestinationType
}

export type DestinationCreationRequest = Omit<Destination, 'id'>

export const isDestinationCreationRequest = (value: unknown): value is DestinationCreationRequest =>
  isObject(value) &&
  hasStringProperty(value, 'name') &&
  hasStringLiteralProperty(value, 'type', destinationTypes) &&
  hasStringToStringMapProperty(value, 'requiredTags')

export type DiscordDestinationCreationRequest = Omit<DestinationCreationRequest, 'type'> & {
  type: 'discord'
}

export const isDiscordDestinationCreationRequest = (value: unknown): value is DiscordDestinationCreationRequest => {
  if (!isDestinationCreationRequest(value)) return false
  if (value.type !== 'discord') return false
  const requiredTags = ['guild-id', 'channel-id', 'send-discord']
  const tags = Object.keys(value.requiredTags)
  return requiredTags.every(requiredTag => tags.includes(requiredTag))
}

export const shouldSendToDestination = (destination: Destination, notification: Notification) => {
  const requiredTags = destination.requiredTags
  const shouldSend = Object.keys(requiredTags).every(requiredTag => {
    const requiredTagValue = requiredTags[requiredTag]
    if (requiredTagValue === '*') return notification.tags[requiredTag] !== undefined
    return notification.tags[requiredTag] === requiredTagValue
  })
  return shouldSend
}
