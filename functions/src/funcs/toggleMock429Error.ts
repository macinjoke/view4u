import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { toggleMock429Flag } from '../utils/mockFlags'

// モックAPIで429エラーを切り替える関数
export const toggleMock429Error = onCall(async (request) => {
  try {
    // 認証されたユーザーのuidを取得
    const uid = request.auth?.uid
    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    // 429エラーの発生状態を切り替え (Firestoreで管理)
    const newFlag = await toggleMock429Flag(uid)

    logger.info('Mock 429 error toggled:', {
      shouldTrigger: newFlag,
      uid,
    })

    return {
      shouldTrigger: newFlag,
      message: newFlag ? 'Mock 429 error enabled' : 'Mock 429 error disabled',
    }
  } catch (error) {
    logger.error('Failed to toggle mock 429 error:', error)
    throw new HttpsError('internal', 'Failed to toggle mock 429 error')
  }
})
