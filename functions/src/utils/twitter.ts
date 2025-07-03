import { HttpsError } from 'firebase-functions/v2/https'
import { TwitterApi } from 'twitter-api-v2'

// X API client setup
export const getTwitterClient = () => {
  const bearerToken = process.env.X_API_BEARER_TOKEN
  if (!bearerToken) {
    throw new HttpsError('failed-precondition', 'X API Bearer Token is not configured')
  }
  return new TwitterApi(bearerToken)
}
