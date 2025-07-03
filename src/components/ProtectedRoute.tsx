import { Box, Spinner, Text } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isUserLoadingAtom, userAtom } from '../atoms/userAtom'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [userData] = useAtom(userAtom)
  const [isUserLoading] = useAtom(isUserLoadingAtom)

  if (isUserLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        gap={3}
      >
        <Spinner size="lg" />
        <Text>読み込み中...</Text>
      </Box>
    )
  }

  if (!userData) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
