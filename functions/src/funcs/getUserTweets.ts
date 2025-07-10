import * as logger from 'firebase-functions/logger'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import type { TweetV2UserTimelineParams } from 'twitter-api-v2'
import { getTwitterClientWithOAuth } from '../utils/twitter'

const consumerSecret = defineSecret('X_API_CONSUMER_SECRET')

// Get user tweets
export const getUserTweets = onCall(
  {
    region: 'asia-northeast1',
    secrets: [consumerSecret],
  },
  async (request) => {
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

      // デバッグログを追加
      logger.info('Request params:', { userId, maxResults, sinceId, untilId, uid })

      const client = await getTwitterClientWithOAuth(uid)

      // パラメータオブジェクトを動的に構築（null/undefinedのプロパティを除外）
      const timelineOptions: Partial<TweetV2UserTimelineParams> = {
        max_results: maxResults,
        'tweet.fields': [
          'created_at',
          'public_metrics',
          'entities',
          'attachments',
          'referenced_tweets',
        ],
        'user.fields': ['name', 'username', 'profile_image_url'],
        'media.fields': ['type', 'url', 'preview_image_url', 'width', 'height'],
        expansions: ['author_id', 'attachments.media_keys'],
      }

      // since_idが有効な値の場合のみ追加
      if (sinceId && sinceId !== null && sinceId !== undefined && sinceId !== '') {
        timelineOptions.since_id = sinceId
      }

      // until_idが有効な値の場合のみ追加
      if (untilId && untilId !== null && untilId !== undefined && untilId !== '') {
        timelineOptions.until_id = untilId
      }

      const response = await client.v2.userTimeline(userId, timelineOptions)

      const tweets =
        response.data.data?.map((tweet) => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at || '',
          author: {
            id: tweet.author_id || '',
            name: response.includes?.users?.find((user) => user.id === tweet.author_id)?.name || '',
            username:
              response.includes?.users?.find((user) => user.id === tweet.author_id)?.username || '',
            profile_image_url:
              response.includes?.users?.find((user) => user.id === tweet.author_id)
                ?.profile_image_url || '',
          },
          public_metrics: {
            retweet_count: tweet.public_metrics?.retweet_count || 0,
            like_count: tweet.public_metrics?.like_count || 0,
            reply_count: tweet.public_metrics?.reply_count || 0,
            quote_count: tweet.public_metrics?.quote_count || 0,
            bookmark_count: tweet.public_metrics?.bookmark_count,
            impression_count: tweet.public_metrics?.impression_count,
          },
          entities: tweet.entities,
          attachments: tweet.attachments,
          referenced_tweets: tweet.referenced_tweets,
        })) || []

      const media =
        response.includes?.media?.map((m) => ({
          media_key: m.media_key || '',
          type: m.type,
          url: m.url,
          preview_image_url: m.preview_image_url,
          width: m.width,
          height: m.height,
        })) || []

      return { tweets, media }
    } catch (error) {
      logger.error('Failed to fetch user tweets:', error)

      // 429エラー（Rate Limit）の場合は特別に処理
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 429) {
          throw new HttpsError('resource-exhausted', 'Rate limit exceeded. Please wait 15 minutes.')
        }
      }

      throw new HttpsError('internal', 'Failed to fetch user tweets')
    }
  },
)
