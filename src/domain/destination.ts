import { hasStringLiteralProperty, hasStringProperty, hasStringToStringMapProperty, isObject } from './typeguards'

export type Destination = {
  id: string
  name: string
  type: DestinationType
  requiredTags: Record<string, string>
}

export const destinationTypes = ['discord'] as const
export type DestinationType = (typeof destinationTypes)[number]

export type DestinationCreationRequest = Omit<Destination, 'id'>

export const isDestinationCreationRequest = (value: unknown) =>
  isObject(value) &&
  hasStringProperty(value, 'name') &&
  hasStringLiteralProperty(value, 'type', destinationTypes) &&
  hasStringToStringMapProperty(value, 'requiredTags')
