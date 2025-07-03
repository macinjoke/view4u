import { Box, Heading, Text } from '@chakra-ui/react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError() as Error & { status?: number; statusText?: string }

  return (
    <Box p={5} textAlign="center">
      <Heading size="xl" mb={4}>
        エラーが発生しました
      </Heading>
      <Text mb={6} color="gray.600">
        申し訳ございません。予期しないエラーが発生しました。
      </Text>
      {error && (
        <Box mt={5} p={4} bg="gray.50" borderRadius="md" textAlign="left" maxW="600px" mx="auto">
          <Text fontWeight="bold" mb={2}>
            エラー詳細:
          </Text>
          <Text mb={1}>
            {error.status} {error.statusText}
          </Text>
          <Text>{error.message}</Text>
        </Box>
      )}
    </Box>
  )
}

export default ErrorPage
