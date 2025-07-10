import { Alert, Box, Center, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { userAtom } from '../../../atoms/userAtom'
import { getUserByUsername, getUserTweets } from '../../../lib/twitter'
import TweetCard from '../../TweetCard/TweetCard'

function Timeline() {
  const [user] = useAtom(userAtom)

  // ユーザー情報取得のクエリ
  const userDataQuery = useQuery({
    queryKey: ['user', user?.targetUserId],
    queryFn: () => {
      if (!user?.targetUserId) {
        throw new Error('Target user ID is required')
      }
      return getUserByUsername(user.targetUserId)
    },
    enabled: !!user?.targetUserId,
  })

  // ツイート取得のクエリ
  const tweetsQuery = useQuery({
    queryKey: ['tweets', userDataQuery.data?.id],
    queryFn: () => {
      if (!userDataQuery.data?.id) {
        throw new Error('User data ID is required')
      }
      return getUserTweets(userDataQuery.data.id, { maxResults: 20 })
    },
    enabled: !!userDataQuery.data?.id,
  })

  if (!user?.targetUserId) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>
          タイムライン
        </Heading>
        <Alert.Root status="warning">
          <Alert.Indicator />
          設定画面で対象ユーザーを設定してください。
        </Alert.Root>
      </Box>
    )
  }

  if (userDataQuery.isLoading || tweetsQuery.isLoading) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>
          タイムライン
        </Heading>
        <Center py={8}>
          <Spinner size="lg" />
        </Center>
      </Box>
    )
  }

  // キャッシュされたデータがある場合は表示（エラーがあってもキャッシュを表示）
  if (tweetsQuery.data) {
    const tweets = tweetsQuery.data?.tweets || []
    const media = tweetsQuery.data?.media || []
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>
          タイムライン
        </Heading>
        {tweetsQuery.error && (
          <Alert.Root status="warning" mb={4}>
            <Alert.Indicator />
            データの更新に失敗しました。X
            APIの制限により15分に1度の更新となります。キャッシュされたデータを表示しています。
          </Alert.Root>
        )}
        <Text mb={6} color="gray.600">
          対象アカウントの投稿一覧
        </Text>

        {tweets.length === 0 && (
          <Alert.Root status="info">
            <Alert.Indicator />
            ツイートはありません。
          </Alert.Root>
        )}

        <VStack gap={0} align="stretch">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} media={media} />
          ))}
        </VStack>
      </Box>
    )
  }

  // データもキャッシュもない場合のエラー表示
  if (userDataQuery.error || tweetsQuery.error) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>
          タイムライン
        </Heading>
        <Alert.Root status="error">
          <Alert.Indicator />
          {userDataQuery.error?.message || tweetsQuery.error?.message || 'エラーが発生しました'}
        </Alert.Root>
      </Box>
    )
  }

  return (
    <Alert.Root status="warning" mb={4}>
      <Alert.Indicator />
      不明なエラーが発生しました
    </Alert.Root>
  )
}

export default Timeline
