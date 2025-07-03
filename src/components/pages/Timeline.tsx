import { Alert, Box, Center, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { userAtom } from '../../atoms/userAtom'
import { twitterService } from '../../lib/twitter'
import type { Tweet, TweetMedia } from '../../types/tweet'
import TweetCard from '../TweetCard'

function Timeline() {
  const [user] = useAtom(userAtom)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [media, setMedia] = useState<TweetMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTweets = async () => {
      if (!user?.targetUserId) {
        setError('対象ユーザーIDが設定されていません')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result1 = await twitterService.getUserByUsername(user.targetUserId)
        console.log('result1:', result1)
        alert('成功しました！ログを見て')
        const result2 = await twitterService.getUserTweets(result1.id, {
          maxResults: 20,
        })
        setTweets(result2.tweets)
        setMedia(result2.media)
      } catch (err) {
        console.error(err)
        setError('ツイートの取得に失敗しました。API設定を確認してください。')
      }

      setLoading(false)
    }

    fetchTweets()
  }, [user?.targetUserId])

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

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        タイムライン
      </Heading>
      <Text mb={6} color="gray.600">
        対象アカウントの投稿一覧
      </Text>

      {loading && (
        <Center py={8}>
          <Spinner size="lg" />
        </Center>
      )}

      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          {error}
        </Alert.Root>
      )}

      {!loading && tweets.length === 0 && !error && (
        <Alert.Root status="info">
          <Alert.Indicator />
          ツイートが見つかりませんでした。
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

export default Timeline
