import * as logger from 'firebase-functions/logger'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { getTwitterClientWithOAuth } from '../utils/twitter'

const consumerSecret = defineSecret('X_API_CONSUMER_SECRET')

// Get user by username
export const getUserByUsername = onCall(
  { region: 'asia-northeast1', secrets: [consumerSecret] },
  async (request) => {
    try {
      const { username } = request.data

      if (!username) {
        throw new HttpsError('invalid-argument', 'username is required')
      }

      // 認証されたユーザーのuidを取得
      const uid = request.auth?.uid
      if (!uid) {
        throw new HttpsError('unauthenticated', 'User must be authenticated')
      }

      const client = await getTwitterClientWithOAuth(uid)

      const response = await client.v2.userByUsername(username, {
        'user.fields': ['id', 'name', 'username', 'profile_image_url'],
      })
      console.log('response:', response)

      return response.data
    } catch (error) {
      logger.error('Failed to fetch user by username:', error)
      throw new HttpsError('internal', 'Failed to fetch user by username')
    }
  },
)
