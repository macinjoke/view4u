import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { getTwitterClient } from '../utils/twitter'

// Get user by username
export const getUserByUsername = onCall(async (request) => {
  try {
    const { username } = request.data

    if (!username) {
      throw new HttpsError('invalid-argument', 'username is required')
    }

    const client = getTwitterClient()
    const response = await client.v2.userByUsername(username, {
      'user.fields': ['id', 'name', 'username', 'profile_image_url'],
    })
    console.log('response:', response)

    return response.data
  } catch (error) {
    logger.error('Failed to fetch user by username:', error)
    throw new HttpsError('internal', 'Failed to fetch user by username')
  }
})
