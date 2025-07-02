import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
