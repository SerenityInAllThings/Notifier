import { Router } from 'express'
import { isDestinationCreationRequest } from '../domain/destination'
import { getPersistence } from '../locator'

export const router = Router()

router.post('/', async (req, res) => {
  if (!isDestinationCreationRequest(req.body)) {
    res.status(400).send('Invalid payload')
    return
  }
  const destination = await getPersistence().createDestination(req.body)
  res.status(201).json(destination)
})

router.get('/', async (_req, res) => {
  const destinations = await getPersistence().getAllDestinations()
  res.status(200).json(destinations)
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  await getPersistence().deleteDestination(id)
  res.status(204).send()
})
