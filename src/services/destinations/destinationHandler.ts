import { Destination, DestinationType } from '../../domain/destination'
import { Notification } from '../../domain/notification'

export type DestinationHandler = {
  destinationType: DestinationType
  send: (notification: Notification, destination: Destination) => Promise<boolean>
}
