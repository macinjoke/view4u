import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { mockUser } from '../data/mockData'
import { getMock429Flag } from '../utils/mockFlags'

// モック版：Get user by username
export const mockGetUserByUsername = onCall(async (request) => {
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

    logger.info('Mock getUserByUsername called:', { username, uid })

    // 429エラーをシミュレート (Firestoreからフラグを取得)
    const shouldTrigger429 = await getMock429Flag()
    if (shouldTrigger429) {
      logger.warn('Simulating 429 error')
      throw new HttpsError('resource-exhausted', 'Rate limit exceeded. Please try again later.')
    }

    // 少し遅延を入れてリアルなAPIっぽくする
    await new Promise((resolve) => setTimeout(resolve, 200))

    // 要求されたusernameに関係なく、モックユーザーを返す
    return mockUser
  } catch (error) {
    logger.error('Failed to fetch user by username (mock):', error)

    // 429エラーの場合はそのまま再スロー
    if (error instanceof HttpsError && error.code === 'resource-exhausted') {
      throw error
    }

    throw new HttpsError('internal', 'Failed to fetch user by username')
  }
})
