import { Link as ChakraLink } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavLinkProps {
  to: string
  children: ReactNode
}

function NavLink({ to, children }: NavLinkProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to}>
      <ChakraLink
        fontWeight="medium"
        color="gray.600"
        bg={isActive ? 'blue.100' : 'transparent'}
        px={3}
        py={2}
        rounded="md"
        _hover={{ bg: 'blue.100' }}
        textDecoration="none"
        transition="background 0.2s"
      >
        {children}
      </ChakraLink>
    </Link>
  )
}

export default NavLink
