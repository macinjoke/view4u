import { signInWithPopup, signOut, TwitterAuthProvider } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export const signInWithTwitter = async () => {
  try {
    const provider = new TwitterAuthProvider()
    provider.addScope('tweet.read')
    provider.addScope('users.read')

    const result = await signInWithPopup(auth, provider)
    const credential = TwitterAuthProvider.credentialFromResult(result)

    if (credential && result.user) {
      // OAuthトークンをFirestoreに保存
      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          twitterAccessToken: credential.accessToken,
          twitterSecret: credential.secret,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
    }

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
