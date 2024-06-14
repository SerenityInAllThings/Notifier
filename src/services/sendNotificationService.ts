import { Destination, shouldSendToDestination } from '../domain/destination'
import { Notification } from '../domain/notification'
import { getDestinationHandler, getPersistence } from '../locator'

export const sendNotifications = async () => {
  const { toBeSent, destinations, recentlySent } = await getNotificationsAndDestinations()
  const toBeNotified = toBeSent.flatMap(notification => {
    const destinationsToUse = destinations.filter(destination => shouldSendToDestination(destination, notification))
    // TODO: verificar se já não foi enviada para destino
    return { notification, destinations: destinationsToUse }
  })
  const sendingPromises = toBeNotified.map(({ notification, destinations }) =>
    sendNotification(notification, destinations)
  )
  await Promise.all(sendingPromises)
}

const getNotificationsAndDestinations = async () => {
  const db = getPersistence()
  const toBeSentPromise = db.getNotificationToBeSent()
  const destinationsPromise = db.getAllDestinations()
  const recentlySentPromise = db.getRecentlySentNotifications()
  const [toBeSent, destinations, recentlySent] = await Promise.all([
    toBeSentPromise,
    destinationsPromise,
    recentlySentPromise,
  ])
  return { toBeSent, destinations, recentlySent }
}

const sendNotification = async (notification: Notification, destinations: Destination[]) => {
  for (const destination of destinations) {
    const handler = getDestinationHandler(destination.type)
    await handler.send(notification)
  }
  await getPersistence().markNotificationAsSent(notification, destinations)
}
