import * as logger from 'firebase-functions/logger'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { mockMedia, mockTweets } from '../data/mockData'
import { getMock429Flag } from '../utils/mockFlags'

// モック版：Get user tweets
export const mockGetUserTweets = onCall({ region: 'asia-northeast1' }, async (request) => {
  try {
    const { userId, maxResults = 20, sinceId, untilId } = request.data

    if (!userId) {
      throw new HttpsError('invalid-argument', 'userId is required')
    }

    // 認証されたユーザーのuidを取得
    const uid = request.auth?.uid
    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    logger.info('Mock getUserTweets called:', { userId, maxResults, sinceId, untilId, uid })

    // 429エラーをシミュレート (Firestoreからフラグを取得)
    const shouldTrigger429 = await getMock429Flag()
    if (shouldTrigger429) {
      logger.warn('Simulating 429 error')
      throw new HttpsError('resource-exhausted', 'Rate limit exceeded. Please try again later.')
    }

    // 少し遅延を入れてリアルなAPIっぽくする
    await new Promise((resolve) => setTimeout(resolve, 500))

    // モックデータをフィルタリング（パラメータに基づく）
    let filteredTweets = [...mockTweets]

    // sinceIdが指定されている場合、そのID以降のツイートのみを返す
    if (sinceId) {
      const sinceIndex = mockTweets.findIndex((tweet) => tweet.id === sinceId)
      if (sinceIndex !== -1) {
        filteredTweets = mockTweets.slice(0, sinceIndex)
      }
    }

    // untilIdが指定されている場合、そのID以前のツイートのみを返す
    if (untilId) {
      const untilIndex = mockTweets.findIndex((tweet) => tweet.id === untilId)
      if (untilIndex !== -1) {
        filteredTweets = mockTweets.slice(untilIndex + 1)
      }
    }

    // maxResultsで制限
    const tweets = filteredTweets.slice(0, maxResults)

    return {
      tweets,
      media: mockMedia,
    }
  } catch (error) {
    logger.error('Failed to fetch user tweets (mock):', error)

    // 429エラーの場合はそのまま再スロー
    if (error instanceof HttpsError && error.code === 'resource-exhausted') {
      throw error
    }

    throw new HttpsError('internal', 'Failed to fetch user tweets')
  }
})
