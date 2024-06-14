import { getPersistence } from '../locator'
import { Notification } from '../domain/notification'

export const getUnsetNotifications = async (): Promise<Notification[]> => {
  const notifications = await getPersistence().getNotificationToBeSent()
  return notifications
}
