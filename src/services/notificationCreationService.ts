import { NotificationCreationRequest, Notification } from '../domain/notification'
import { getPersistence, getQueue } from '../locator'

export const createNotification = async (newNotification: NotificationCreationRequest): Promise<Notification> => {
  const notification = await getPersistence().createNotification(newNotification)
  await getQueue().enqueueSentNotification()
  return notification
}
