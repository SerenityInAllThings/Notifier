import { DestinationType } from '../../domain/destination'
import { Notification } from '../../domain/notification'
import { DestinationHandler } from './destinationHandler'

export class DiscordDestinationHandler implements DestinationHandler {
  destinationType = 'discord' as DestinationType
  async send(notification: Notification) {
    console.log(`Sending notification ${notification.id} to discord`)
    return true
  }
}
