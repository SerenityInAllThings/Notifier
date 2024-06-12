import { DestinationCreationRequest, isDestinationCreationRequest } from './destination'

describe('DestinationCreationRequest', () => {
  describe('isDestinationCreationRequest', () => {
    it('should return true for a valid DestinationCreationRequest', () => {
      const validRequest: DestinationCreationRequest = {
        name: 'blend-discord',
        type: 'discord',
        requiredTags: {
          'send-discord': '*',
          'discord-channel': '*',
        },
      }

      expect(isDestinationCreationRequest(validRequest)).toBe(true)
    })

    it('should return false when invalid type is provided', () => {
      const invalidRequest = {
        name: 'blend-discord',
        type: 'invalid-type',
        requiredTags: {
          'send-discord': '*',
          'discord-channel': '*',
        },
      }

      expect(isDestinationCreationRequest(invalidRequest)).toBe(false)
    })

    it('should return false when requiredTags is not an object', () => {
      const invalidRequest = {
        name: 'blend-discord',
        type: 'discord',
        requiredTags: 'not-an-object',
      }

      expect(isDestinationCreationRequest(invalidRequest)).toBe(false)
    })
  })
})
