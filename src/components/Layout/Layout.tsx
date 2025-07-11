import { Box, Button, Link as ChakraLink, Flex, HStack, Spinner, Text } from '@chakra-ui/react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { isUserLoadingAtom, userAtom } from '../../atoms/userAtom'
import { auth, db } from '../../firebase'
import { signOutUser } from '../../lib/auth'
import { toggleMock429Error } from '../../lib/twitter'
import NavLink from './NavLink/NavLink'

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

  const onToggle429Click = async () => {
    console.log('onToggle429Click')
    await toggleMock429Error()
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
      <Box as="nav" p={{ base: 3, md: 5 }} bg="gray.100" borderBottom="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center">
          <HStack gap={{ base: 2, md: 4 }}>
            <NavLink to="/">ホーム</NavLink>
            {user && (
              <>
                <NavLink to="/settings">設定</NavLink>
                {import.meta.env.DEV && (
                  <Button onClick={onToggle429Click} size="xs" p="0" fontSize="8px">
                    429
                  </Button>
                )}
              </>
            )}
          </HStack>

          <Box>
            {user ? (
              <HStack gap={{ base: 2, md: 4 }}>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{user.displayName || 'null'}</Text>
                <Button onClick={handleSignOut} colorScheme="red" size={{ base: 'sm', md: 'md' }}>
                  ログアウト
                </Button>
              </HStack>
            ) : (
              <Link to="/login">
                <ChakraLink fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                  ログイン
                </ChakraLink>
              </Link>
            )}
          </Box>
        </Flex>
      </Box>

      <Outlet />
    </Box>
  )
}

export default Layout
