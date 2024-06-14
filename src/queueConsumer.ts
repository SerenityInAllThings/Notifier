import { Consumer } from 'sqs-consumer'
import { getNewNotificationsQueueUrl, getSqsRegion } from './config/environmentVariables'
import { sendNotifications } from './services/sendNotificationService'

const app = Consumer.create({
  queueUrl: getNewNotificationsQueueUrl(),
  region: getSqsRegion(),
  handleMessage: async message => {
    if (!message.Body) {
      console.warn('Received empty message')
      return
    }
    console.log('Received message', message)
    await sendNotifications()
  },
})

app.on('error', err => {
  console.error('error', err.message)
})

app.on('processing_error', err => {
  console.error('Error processing message', err.message)
})

export const startQueueConsumer = () => {
  app.start()
}

export const stopQueueConsumer = () => {
  app.stop()
}
