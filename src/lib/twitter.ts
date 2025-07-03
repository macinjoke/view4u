import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import type { Tweet, TweetMedia } from '../types/tweet'

// Firebase Functions の初期化
const functions = getFunctions()
connectFunctionsEmulator(functions, 'localhost', 5001)

// ユーザーのツイートを取得する関数
export async function getUserTweets(
  userId: string,
  options?: {
    maxResults?: number
    sinceId?: string
    untilId?: string
  },
): Promise<{ tweets: Tweet[]; media: TweetMedia[] }> {
  try {
    console.log(`🌐 Fetching tweets for user ${userId} from API...`)
    const getUserTweetsFunction = httpsCallable(functions, 'getUserTweets')
    const result = await getUserTweetsFunction({
      userId,
      maxResults: options?.maxResults,
      sinceId: options?.sinceId,
      untilId: options?.untilId,
    })

    const responseData = result.data as { tweets: Tweet[]; media: TweetMedia[] }
    return responseData
  } catch (error) {
    console.error('Failed to fetch user tweets:', error)
    throw error
  }
}

// ユーザー名からユーザー情報を取得する関数
export async function getUserByUsername(username: string) {
  try {
    console.log(`🌐 Fetching user data for @${username} from API...`)
    const getUserByUsernameFunction = httpsCallable(functions, 'getUserByUsername')
    const result = await getUserByUsernameFunction({ username })

    return result.data
  } catch (error) {
    console.error('Failed to fetch user by username:', error)
    throw error
  }
}
