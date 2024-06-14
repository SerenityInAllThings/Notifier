import { Router } from 'express'
import { isNotificationCreationRequest } from '../domain/notification'
import { createNotification } from '../services/notificationCreationService'
import { getUnsetNotifications } from '../services/notificationRetrievalService'

export const router = Router()

router.post('/', async (req, res) => {
  if (!isNotificationCreationRequest(req.body)) {
    res.status(400).send('Invalid payload')
    return
  }
  await createNotification(req.body)
  res.status(201).send('Notification created')
})

router.get('/', async (_req, res) => {
  const notifications = await getUnsetNotifications()
  res.status(200).json({ unsent: notifications })
})
