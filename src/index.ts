import { startQueueConsumer } from './queueConsumer'
import { startServer } from './webserver'

startServer()
startQueueConsumer()
