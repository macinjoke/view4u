import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  type User,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ユーザーがログインした場合、Firestoreにユーザードキュメントを作成
        try {
          const userDocRef = doc(db, 'users', user.uid)
          await setDoc(
            userDocRef,
            {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              updatedAt: new Date(),
            },
            { merge: true },
          )
        } catch (error) {
          console.error('ユーザードキュメント作成エラー:', error)
        }
      }
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithTwitter = async () => {
    try {
      const provider = new TwitterAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Twitter認証エラー:', error)
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('サインアウトエラー:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithTwitter,
    signOut: signOutUser,
  }
}
