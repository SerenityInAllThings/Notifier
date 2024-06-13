import { Destination, DestinationCreationRequest } from '../domain/destination'
import { NotificationCreationRequest, Notification } from '../domain/notification'

export type Db = {
  createNotification: (notification: NotificationCreationRequest) => Promise<Notification>
  getNotificationToBeSent: () => Promise<Notification[]>
  markNotificationsAsSent: (notifications: Notification[]) => Promise<void>
  getRecentlySentNotifications: () => Promise<Notification[]>

  createDestination: (destination: DestinationCreationRequest) => Promise<Destination>
  getAllDestinations: () => Promise<Destination[]>
}
