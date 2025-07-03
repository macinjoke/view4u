import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import type { Tweet, TweetMedia } from '../types/tweet'

interface CachedUserData {
  data: any
  timestamp: number
  expiresAt: number
}

class TwitterService {
  private functions = getFunctions()
  private readonly CACHE_DURATION = 15 * 60 * 1000 // 15分間キャッシュ

  constructor() {
    connectFunctionsEmulator(this.functions, 'localhost', 5001)
  }

  private getCacheKey(type: string, identifier: string): string {
    return `twitter_cache_${type}_${identifier}`
  }

  private isValidCache(cachedData: CachedUserData): boolean {
    return cachedData && Date.now() < cachedData.expiresAt
  }

  private saveToCache(key: string, data: any): void {
    const cacheData: CachedUserData = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
    }
    try {
      localStorage.setItem(key, JSON.stringify(cacheData))
      console.log(`💾 Cached data for ${key} (expires in 15min)`)
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  private getFromCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const cachedData: CachedUserData = JSON.parse(cached)
      if (this.isValidCache(cachedData)) {
        console.log(`📦 Using cached data for ${key}`)
        return cachedData.data
      } else {
        // 期限切れのキャッシュを削除
        localStorage.removeItem(key)
        console.log(`🗑️ Expired cache removed for ${key}`)
        return null
      }
    } catch (error) {
      console.warn('Failed to get from localStorage:', error)
      return null
    }
  }

  // キャッシュをクリアするユーティリティメソッド
  public clearCache(type?: string): void {
    try {
      const keys = Object.keys(localStorage)
      const twitterCacheKeys = keys.filter((key) => {
        if (type) {
          return key.startsWith(`twitter_cache_${type}_`)
        }
        return key.startsWith('twitter_cache_')
      })

      twitterCacheKeys.forEach((key) => localStorage.removeItem(key))
      console.log(
        `🧹 Cleared ${twitterCacheKeys.length} cache entries${type ? ` for type: ${type}` : ''}`,
      )
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  async getUserTweets(
    userId: string,
    options?: {
      maxResults?: number
      sinceId?: string
      untilId?: string
    },
  ): Promise<{ tweets: Tweet[]; media: TweetMedia[] }> {
    // キャッシュキーを生成（オプションも含める）
    const optionsKey = JSON.stringify({
      maxResults: options?.maxResults || 20,
      sinceId: options?.sinceId || '',
      untilId: options?.untilId || '',
    })
    const cacheKey = this.getCacheKey('user_tweets', `${userId}_${btoa(optionsKey)}`)

    // キャッシュから取得を試行
    const cachedData = this.getFromCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      console.log(`🌐 Fetching tweets for user ${userId} from API...`)
      const getUserTweetsFunction = httpsCallable(this.functions, 'getUserTweets')
      const result = await getUserTweetsFunction({
        userId,
        maxResults: options?.maxResults,
        sinceId: options?.sinceId,
        untilId: options?.untilId,
      })

      const responseData = result.data as { tweets: Tweet[]; media: TweetMedia[] }

      // 成功した場合はキャッシュに保存
      this.saveToCache(cacheKey, responseData)

      return responseData
    } catch (error) {
      console.error('Failed to fetch user tweets:', error)
      throw error
    }
  }

  async getUserByUsername(username: string) {
    const cacheKey = this.getCacheKey('user_by_username', username)

    // キャッシュから取得を試行
    const cachedData = this.getFromCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      console.log(`🌐 Fetching user data for @${username} from API...`)
      const getUserByUsernameFunction = httpsCallable(this.functions, 'getUserByUsername')
      const result = await getUserByUsernameFunction({ username })

      // 成功した場合はキャッシュに保存
      this.saveToCache(cacheKey, result.data)

      return result.data
    } catch (error) {
      console.error('Failed to fetch user by username:', error)
      throw error
    }
  }
}

export const twitterService = new TwitterService()
