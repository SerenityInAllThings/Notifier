import { Router } from 'express'
import { isDestinationCreationRequest } from '../domain/destination'

export const router = Router()

router.post('/', async (req, res) => {
  if (!isDestinationCreationRequest(req.body)) {
    res.status(400).send('Invalid payload')
    return
  }
  // TODO: validate payload
  // TODO: persist destination
  res.status(201).json({ 'um dia': 'eu existirei' })
})
