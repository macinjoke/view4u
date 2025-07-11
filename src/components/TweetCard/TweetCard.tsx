// import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Avatar, Box, Card, HStack, Image, Link, Text, VStack } from '@chakra-ui/react'
import type { Tweet, TweetMedia } from '../../types/tweet'

interface TweetCardProps {
  tweet: Tweet
  media?: TweetMedia[]
}

function TweetCard({ tweet, media }: TweetCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const tweetUrl = `https://x.com/${tweet.author.username}/status/${tweet.id}`

  const attachedMedia = media?.filter((m) => tweet.attachments?.media_keys?.includes(m.media_key))

  return (
    <Card.Root mb={{ base: 3, md: 4 }} variant="outline">
      <Card.Body p={{ base: 3, md: 4 }}>
        <HStack align="start" gap={{ base: 2, md: 3 }}>
          <Avatar.Root size={{ base: 'xs', md: 'sm' }}>
            <Avatar.Image src={tweet.author.profile_image_url} alt={tweet.author.name} />
            <Avatar.Fallback>{tweet.author.name[0]}</Avatar.Fallback>
          </Avatar.Root>
          <VStack align="start" flex={1} gap={2}>
            <VStack align="start" gap={1}>
              <HStack wrap="wrap" gap={1}>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {tweet.author.name}
                </Text>
                <Text color="gray.500" fontSize={{ base: 'xs', md: 'sm' }}>
                  @{tweet.author.username}
                </Text>
              </HStack>
              <Text color="gray.500" fontSize={{ base: 'xs', md: 'sm' }}>
                {formatDate(tweet.created_at)}
              </Text>
            </VStack>

            <Text whiteSpace="pre-wrap" fontSize={{ base: 'sm', md: 'md' }}>
              {tweet.text}
            </Text>

            {attachedMedia && attachedMedia.length > 0 && (
              <Box>
                {attachedMedia.map((mediaItem) => (
                  <Box key={mediaItem.media_key} mt={2}>
                    {mediaItem.type === 'photo' && mediaItem.url && (
                      <Image
                        src={mediaItem.url}
                        alt="ツイート画像"
                        maxW="100%"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      />
                    )}
                    {mediaItem.type === 'video' && mediaItem.preview_image_url && (
                      <Box position="relative">
                        <Image
                          src={mediaItem.preview_image_url}
                          alt="動画のプレビュー"
                          maxW="100%"
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.200"
                        />
                        <Text
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          bg="blackAlpha.700"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                        >
                          動画
                        </Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <HStack
              gap={{ base: 3, md: 6 }}
              color="gray.500"
              fontSize={{ base: 'xs', md: 'sm' }}
              wrap="wrap"
            >
              <Text>返信 {tweet.public_metrics.reply_count}</Text>
              <Text>リポスト {tweet.public_metrics.retweet_count}</Text>
              <Text>いいね {tweet.public_metrics.like_count}</Text>
              {tweet.public_metrics.bookmark_count !== undefined && (
                <Text>保存 {tweet.public_metrics.bookmark_count}</Text>
              )}
              {tweet.public_metrics.impression_count !== undefined && (
                <Text display={{ base: 'none', sm: 'block' }}>
                  インプレッション {tweet.public_metrics.impression_count.toLocaleString()}
                </Text>
              )}
            </HStack>

            <Link
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="blue.500"
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              Xで開く
            </Link>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  )
}

export default TweetCard
