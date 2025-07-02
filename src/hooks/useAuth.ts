import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  type User,
} from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { userAtom } from '../atoms/userAtom'
import { auth, db } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const setUserData = useSetAtom(userAtom)

  useEffect(() => {
    let userDataUnsubscribe: (() => void) | null = null

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

          // ユーザーデータをリアルタイムで購読
          userDataUnsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data()
              setUserData({
                uid: data.uid,
                displayName: data.displayName,
                email: data.email,
                photoURL: data.photoURL,
                targetUserId: data.targetUserId,
                updatedAt: data.updatedAt?.toDate() || new Date(),
              })
            } else {
              setUserData(null)
            }
          })
        } catch (error) {
          console.error('ユーザードキュメント作成エラー:', error)
        }
      } else {
        // ユーザーがログアウトした場合、購読を解除
        if (userDataUnsubscribe) {
          userDataUnsubscribe()
          userDataUnsubscribe = null
        }
        setUserData(null)
      }
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
      if (userDataUnsubscribe) {
        userDataUnsubscribe()
      }
    }
  }, [setUserData])

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
