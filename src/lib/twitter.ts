import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'
import type { Tweet, TweetMedia, TwitterUser } from '../types/tweet'

// connectFunctionsEmulator(functions, 'localhost', 5001)

// 開発環境でモックAPIを使用するかどうかの設定
const USE_MOCK_API =
  import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCK_API === 'true'

// デバッグ用：モックAPIで429エラーを発生させる関数
export async function toggleMock429Error(): Promise<void> {
  if (!USE_MOCK_API) {
    console.warn('Mock API is not enabled. Cannot toggle 429 error.')
    return
  }

  try {
    const toggleFunction = httpsCallable(functions, 'toggleMock429Error')
    await toggleFunction({})
    console.log('Mock 429 error toggled')
  } catch (error) {
    console.error('Failed to toggle mock 429 error:', error)
  }
}

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
    const apiType = USE_MOCK_API ? 'Mock' : 'Real'
    console.log(`🌐 Fetching tweets for user ${userId} from ${apiType} API...`)

    const functionName = USE_MOCK_API ? 'mockGetUserTweets' : 'getUserTweets'
    const getUserTweetsFunction = httpsCallable(functions, functionName)
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
export async function getUserByUsername(username: string): Promise<TwitterUser> {
  try {
    const apiType = USE_MOCK_API ? 'Mock' : 'Real'
    console.log(`🌐 Fetching user data for @${username} from ${apiType} API...`)

    const functionName = USE_MOCK_API ? 'mockGetUserByUsername' : 'getUserByUsername'
    const getUserByUsernameFunction = httpsCallable(functions, functionName)
    const result = await getUserByUsernameFunction({ username })

    return result.data as TwitterUser
  } catch (error) {
    console.error('Failed to fetch user by username:', error)
    throw error
  }
}
