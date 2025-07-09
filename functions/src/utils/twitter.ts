import { getFirestore } from 'firebase-admin/firestore'
import { defineSecret, defineString } from 'firebase-functions/params'
import { HttpsError } from 'firebase-functions/v2/https'
import { TwitterApi } from 'twitter-api-v2'

// X API client setup (App-only authentication)
export const getTwitterClient = () => {
  const bearerToken = defineSecret('X_API_BEARER_TOKEN').value()
  if (!bearerToken) {
    throw new HttpsError('failed-precondition', 'X API Bearer Token is not configured')
  }
  return new TwitterApi(bearerToken)
}

// X API client setup with OAuth (user context)
export const getTwitterClientWithOAuth = async (uid: string) => {
  const consumerKey = defineString('X_API_CONSUMER_KEY').value()
  const consumerSecret = defineSecret('X_API_CONSUMER_SECRET').value()
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
