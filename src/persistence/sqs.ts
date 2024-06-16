import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { Queue } from './queue'
import { client } from '../config/sqs'
import { getNewNotificationsQueueUrl } from '../config/environmentVariables'

export class Sqs implements Queue {
  private readonly client: SQSClient
  private readonly newNotificationQueueUrl: string

  constructor() {
    this.client = client
    this.newNotificationQueueUrl = getNewNotificationsQueueUrl()
  }

  async enqueueNewNotificationEvent(): Promise<void> {
    const message: NewMessagesAvailableEvent = { date: new Date() }
    const command = new SendMessageCommand({
      QueueUrl: this.newNotificationQueueUrl,
      MessageBody: JSON.stringify(message),
    })
    await this.client.send(command)
  }
}

type NewMessagesAvailableEvent = {
  date: Date
}
