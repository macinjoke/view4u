import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithTwitter } from '../../lib/auth'

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleTwitterLogin = async () => {
    setIsLoading(true)
    try {
      await signInWithTwitter()
      navigate('/')
    } catch (error) {
      console.error('ログインに失敗しました:', error)
      alert('ログインに失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box p={5} textAlign="center" maxW="400px" mx="auto" mt={12}>
      <Heading size="lg" mb={4}>
        ログイン
      </Heading>
      <Text mb={6} color="gray.600">
        Xアカウントでログインしてください
      </Text>
      <Button
        onClick={handleTwitterLogin}
        loading={isLoading}
        colorScheme="twitter"
        borderRadius="full"
        size="lg"
        px={8}
      >
        {isLoading ? 'ログイン中...' : 'Xでログイン'}
      </Button>
    </Box>
  )
}

export default Login
