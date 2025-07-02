import { Box, Center, Heading, Text } from '@chakra-ui/react'

function App() {
  return (
    <Center minH="100vh" bg="gray.800" color="white">
      <Box textAlign="center" p={8}>
        <Heading as="h1" size="2xl" mb={4}>
          Hello World
        </Heading>
        <Text fontSize="xl" color="cyan.200">
          View4U - X Account Stalking App
        </Text>
      </Box>
    </Center>
  )
}

export default App
