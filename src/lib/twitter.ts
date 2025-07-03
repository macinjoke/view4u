import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import type { Tweet, TweetMedia } from '../types/tweet'

class TwitterService {
  private functions = getFunctions()

  constructor() {
    connectFunctionsEmulator(this.functions, 'localhost', 5001)
  }

  async getUserTweets(
    userId: string,
    options?: {
      maxResults?: number
      sinceId?: string
      untilId?: string
    },
  ): Promise<{ tweets: Tweet[]; media: TweetMedia[] }> {
    try {
      const getUserTweetsFunction = httpsCallable(this.functions, 'getUserTweets')
      const result = await getUserTweetsFunction({
        userId,
        maxResults: options?.maxResults,
        sinceId: options?.sinceId,
        untilId: options?.untilId,
      })

      return result.data as { tweets: Tweet[]; media: TweetMedia[] }
    } catch (error) {
      console.error('Failed to fetch user tweets:', error)
      throw error
    }
  }

  async getUserByUsername(username: string) {
    try {
      const getUserByUsernameFunction = httpsCallable(this.functions, 'getUserByUsername')
      const result = await getUserByUsernameFunction({ username })
      return result.data
    } catch (error) {
      console.error('Failed to fetch user by username:', error)
      throw error
    }
  }
}

export const twitterService = new TwitterService()
