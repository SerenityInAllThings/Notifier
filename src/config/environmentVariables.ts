export const getWebserverPort = () => {
  const port = process.env.PORT
  if (!port) {
    const defaultPort = 3000
    console.warn('PORT environment variables is not set, using default port:', defaultPort)
    return defaultPort
  }
  const parsedPort = parseInt(port)
  if (isNaN(parsedPort)) {
    const error = 'PORT is not a number, got ' + port
    console.error(error)
    throw new Error(error)
  }
  return parsedPort
}

export const getDynamoDbRegion = () => {
  const region = process.env['DYNAMODB_REGION']
  if (!region) throw new Error(`DYNAMODB_REGION environment variable is not set`)
  return region
}

export const getSqsRegion = () => {
  const region = process.env['SQS_REGION']
  if (!region) throw new Error(`SQS_REGION environment variable is not set`)
  return region
}

export const getNewNotificationsQueueUrl = () => {
  const queueUrl = process.env['NEW_NOTIFICATIONS_QUEUE_URL']
  if (!queueUrl) throw new Error(`NEW_NOTIFICATIONS_QUEUE_URL environment variable is not set`)
  return queueUrl
}
