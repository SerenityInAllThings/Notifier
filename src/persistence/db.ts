import { Destination, DestinationCreationRequest, SentNotification } from '../domain/destination'
import { NotificationCreationRequest, Notification } from '../domain/notification'

export type Db = {
  createNotification: (notification: NotificationCreationRequest) => Promise<Notification>
  getNotificationToBeSent: () => Promise<Notification[]>
  markNotificationAsSent: (notification: Notification, destination: Destination[]) => Promise<SentNotification[]>
  getRecentlySentNotifications: () => Promise<Notification[]>

  createDestination: (destination: DestinationCreationRequest) => Promise<Destination>
  getAllDestinations: () => Promise<Destination[]>
  deleteDestination: (destinationId: string) => Promise<void>
}
