import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { userAtom } from '../atoms/userAtom'
import { auth, db } from '../firebase'
import { signOutUser } from '../lib/auth'

function Layout() {
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

  const handleSignOut = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
    }
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  return (
    <div className="App">
      <nav
        style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link to="/" style={{ margin: '0 10px' }}>
            ホーム
          </Link>
          {user && (
            <>
              <Link to="/timeline" style={{ margin: '0 10px' }}>
                タイムライン
              </Link>
              <Link to="/settings" style={{ margin: '0 10px' }}>
                設定
              </Link>
            </>
          )}
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>こんにちは、{user.displayName || 'ユーザー'}さん</span>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ margin: '0 10px' }}>
              ログイン
            </Link>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
