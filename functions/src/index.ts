import { getApps, initializeApp } from 'firebase-admin/app'
import { setGlobalOptions } from 'firebase-functions'

// Initialize Firebase Admin
if (getApps().length === 0) {
  if (process.env.FUNCTIONS_EMULATOR) {
    // エミュレーター環境での初期化（本番Firestoreに接続）
    initializeApp({
      projectId: 'view4u-prod',
    })
  } else {
    // 本番環境での初期化
    initializeApp()
  }
}

export { getUserByUsername } from './funcs/getUserByUsername'
// Import all functions
export { getUserTweets } from './funcs/getUserTweets'

setGlobalOptions({ maxInstances: 10 })
