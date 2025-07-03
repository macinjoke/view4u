import { Box, Button, Link as ChakraLink, Flex, HStack, Spinner, Text } from '@chakra-ui/react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { isUserLoadingAtom, userAtom } from '../atoms/userAtom'
import { auth, db } from '../firebase'
import { signOutUser } from '../lib/auth'

function Layout() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const setUserData = useSetAtom(userAtom)
  const setIsUserLoading = useSetAtom(isUserLoadingAtom)

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
              setIsUserLoading(false)
            } else {
              setUserData(null)
              setIsUserLoading(false)
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
  }, [setUserData, setIsUserLoading])

  const handleSignOut = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
    }
  }

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="lg" />
        <Text mt={2}>読み込み中...</Text>
      </Box>
    )
  }

  return (
    <Box minH="100vh">
      <Box as="nav" p={5} bg="gray.100" borderBottom="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center">
          <HStack gap={4}>
            <ChakraLink as={Link} to="/" fontWeight="medium">
              ホーム
            </ChakraLink>
            {user && (
              <>
                <ChakraLink as={Link} to="/timeline" fontWeight="medium">
                  タイムライン
                </ChakraLink>
                <ChakraLink as={Link} to="/settings" fontWeight="medium">
                  設定
                </ChakraLink>
              </>
            )}
          </HStack>

          <Box>
            {user ? (
              <HStack gap={4}>
                <Text>こんにちは、{user.displayName || 'ユーザー'}さん</Text>
                <Button onClick={handleSignOut} colorScheme="red" size="sm">
                  ログアウト
                </Button>
              </HStack>
            ) : (
              <ChakraLink as={Link} to="/login" fontWeight="medium">
                ログイン
              </ChakraLink>
            )}
          </Box>
        </Flex>
      </Box>

      <Outlet />
    </Box>
  )
}

export default Layout
