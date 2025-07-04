import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError } from 'firebase-functions/v2/https'
import { TwitterApi } from 'twitter-api-v2'

// X API client setup (App-only authentication)
export const getTwitterClient = () => {
  const bearerToken = process.env.X_API_BEARER_TOKEN
  if (!bearerToken) {
    throw new HttpsError('failed-precondition', 'X API Bearer Token is not configured')
  }
  return new TwitterApi(bearerToken)
}

// X API client setup with OAuth (user context)
export const getTwitterClientWithOAuth = async (uid: string) => {
  const db = getFirestore()

  try {
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found')
    }

    const userData = userDoc.data()
    const accessToken = userData?.twitterAccessToken
    const secret = userData?.twitterSecret

    if (!accessToken || !secret) {
      throw new HttpsError('failed-precondition', 'Twitter OAuth tokens not found for user')
    }

    const consumerKey = process.env.X_API_CONSUMER_KEY
    const consumerSecret = process.env.X_API_CONSUMER_SECRET

    if (!consumerKey || !consumerSecret) {
      throw new HttpsError('failed-precondition', 'Twitter API consumer keys not configured')
    }

    return new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: secret,
    })
  } catch (error) {
    console.error('Error getting Twitter client with OAuth:', error)
    throw error
  }
}
