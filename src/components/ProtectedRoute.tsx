import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { userAtom } from '../atoms/userAtom'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [userData] = useAtom(userAtom)

  if (!userData) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
