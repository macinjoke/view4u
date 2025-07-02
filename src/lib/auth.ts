import { signInWithPopup, signOut, TwitterAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'

export const signInWithTwitter = async () => {
  try {
    const provider = new TwitterAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error('Twitter認証エラー:', error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('サインアウトエラー:', error)
    throw error
  }
}
