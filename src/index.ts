import express, { json } from 'express'
import { router as destinationRouter } from './routers/destinationRouter'
import { router as notificationsRouter } from './routers/notificationsRouter'
import { getWebserverPort } from './config/environmentVariables'

const app = express()
app.use(json())

app.use('/destination', destinationRouter)
app.use('/notifications', notificationsRouter)

app.get('/healthcheck', (_req, res) => {
  res.send('vivão e consciente')
})

const port = getWebserverPort()
app.listen(port, () => {
  console.log('Server is running on port', port)
})
