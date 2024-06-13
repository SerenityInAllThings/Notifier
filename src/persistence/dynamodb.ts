import { client as dynamoClient } from '../config/dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { DestinationCreationRequest, Destination } from '../domain/destination'
import { NotificationCreationRequest, Notification, getSentDate } from '../domain/notification'
import { DeleteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { randomUUID } from 'crypto'
import { Db } from './db'

export class DynamoDbPersistence implements Db {
  private readonly client: DynamoDBClient
  private readonly notificationToBeSentTableName = 'notifications-to-be-sent'
  private readonly sentNotificationTableName = 'sent-notifications'
  private readonly destinationTableName = 'destinations'

  constructor() {
    this.client = dynamoClient
    this.ensureTablesExists()
  }

  private ensureTablesExists() {
    // TODO: code this
  }

  async createNotification(newNotification: NotificationCreationRequest): Promise<Notification> {
    const notification: Notification = {
      ...newNotification,
      id: randomUUID(),
      creationDate: new Date().toISOString(),
    }

    const command = new PutItemCommand({
      TableName: this.notificationToBeSentTableName,
      Item: marshall(notification),
    })
    await this.client.send(command)
    return notification
  }

  async getNotificationToBeSent(): Promise<Notification[]> {
    const scanCommand = new ScanCommand({ TableName: this.notificationToBeSentTableName })
    const response = await this.client.send(scanCommand)
    const notifications = response.Items?.map(item => unmarshall(item) as Notification) ?? []
    return notifications
  }

  async markNotificationsAsSent(notifications: Notification[]): Promise<void> {
    const results = await Promise.all(notifications.map(this.markNotificationAsSent))
    console.log('markNotificationsAsSent results', results)
  }

  private async markNotificationAsSent(notification: Notification): Promise<SentNotification> {
    await this.deleteFromNotificationToBeSentTable(notification)
    const sentNotification: SentNotification = { ...notification, sentDate: getSentDate() }
    await this.insertIntoSentNotificationsTable(sentNotification)
    return sentNotification
  }

  private async deleteFromNotificationToBeSentTable(notification: Notification): Promise<void> {
    const id = notification.id
    const command = new DeleteItemCommand({
      TableName: this.notificationToBeSentTableName,
      Key: { id: { S: id } },
    })
    await this.client.send(command)
    console.debug(`Deleted notification ${id}`)
  }

  private async insertIntoSentNotificationsTable(notification: SentNotification): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.sentNotificationTableName,
      Item: marshall(notification),
    })
    await this.client.send(command)
    console.debug(`Inserted notification ${notification.id} as sent`)
  }

  async getRecentlySentNotifications(): Promise<Notification[]> {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24)
    const todayQuery = this.getRecentlySentNotificationsQuery(today)
    const yesterdayQuery = this.getRecentlySentNotificationsQuery(yesterday)
    const results = await Promise.all([todayQuery, yesterdayQuery])
    const sentNotifications = results.flat()
    return sentNotifications
  }

  private async getRecentlySentNotificationsQuery(date: Date): Promise<SentNotification[]> {
    const command = new QueryCommand({
      TableName: this.sentNotificationTableName,
      KeyConditionExpression: 'sentDate = :sentDate',
      ExpressionAttributeValues: { ':sentDate': { S: getSentDate(date) } },
    })
    const response = await this.client.send(command)
    const sentNotifications = response.Items?.map(item => unmarshall(item) as SentNotification) ?? []
    return sentNotifications
  }

  async createDestination(newDestination: DestinationCreationRequest): Promise<Destination> {
    const destination: Destination = {
      ...newDestination,
      id: randomUUID(),
    }
    const command = new PutItemCommand({
      TableName: this.destinationTableName,
      Item: marshall(destination),
    })
    await this.client.send(command)
    return destination
  }

  async getAllDestinations(): Promise<Destination[]> {
    const command = new ScanCommand({ TableName: this.destinationTableName })
    const response = await this.client.send(command)
    const destinations = response.Items?.map(item => unmarshall(item) as Destination) ?? []
    return destinations
  }

  async deleteDestination(destinationId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.destinationTableName,
      Key: { id: { S: destinationId } },
    })
    await this.client.send(command)
    console.debug(`Deleted destination ${destinationId}`)
  }
}

type SentNotification = Notification & {
  /** YYYY-MM-DD, using notification.ts getSentDate function */
  sentDate: string
}
