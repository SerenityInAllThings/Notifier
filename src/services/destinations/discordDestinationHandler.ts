import { client as discordClient } from '../../config/discord'
import { Destination, DestinationType } from '../../domain/destination'
import { Notification } from '../../domain/notification'
import { DestinationHandler } from './destinationHandler'
import { API, APIChannel } from '@discordjs/core'

export class DiscordDestinationHandler implements DestinationHandler {
  destinationType = 'discord' as DestinationType
  private readonly client: API

  constructor() {
    this.client = discordClient
  }

  async send(notification: Notification, destination: Destination) {
    console.log(`Sending notification ${notification.id} to discord`)
    const { guildId, channelId, sendDiscord } = this.getRequiredTags(notification)
    const { guild, channel } = await this.validateRequiredPermissions(guildId, channelId)
    await this.sendMessage(notification, channel)
    console.log(`Sent notification '${guild.name}' server to discord`)
    return true
  }

  private getRequiredTags(notification: Notification) {
    const guildId = notification.tags['guild-id']
    if (!guildId) throw new Error(`guild-id is not set for notification ${notification.id}`)
    const channelId = notification.tags['channel-id']
    if (!channelId) throw new Error(`channel-id is not set for notification ${notification.id}`)
    const sendDiscord = notification.tags['send-discord']
    if (!sendDiscord) throw new Error(`send-discord is not set for notification ${notification.id}`)
    return { guildId, channelId, sendDiscord }
  }

  private async validateRequiredPermissions(guildId: string, channelId: string) {
    console.debug(`Validating permissions for guild ${guildId} and channel ${channelId}`)
    const guild = await this.client.guilds.get(guildId, { with_counts: false })
    if (!guild) throw new Error(`Guild ${guildId} not found`)
    const channel = await this.client.channels.get(channelId)
    if (!channel) throw new Error(`Channel ${channelId} not found`)
    return { guild, channel }
  }

  private async sendMessage(notification: Notification, channel: APIChannel) {
    // TODO: handle messages longer than 2000 characters
    await this.client.channels.createMessage(channel.id, { content: notification.message })
  }
}
