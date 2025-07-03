export interface Tweet {
  id: string
  text: string
  created_at: string
  author: {
    id: string
    name: string
    username: string
    profile_image_url: string
  }
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
    bookmark_count?: number
    impression_count?: number
  }
  entities?: {
    urls?: Array<{
      start: number
      end: number
      url: string
      expanded_url: string
      display_url: string
    }>
    hashtags?: Array<{
      start: number
      end: number
      tag: string
    }>
    mentions?: Array<{
      start: number
      end: number
      username: string
      id: string
    }>
  }
  attachments?: {
    media_keys?: string[]
  }
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to'
    id: string
  }>
}

export interface TweetMedia {
  media_key: string
  type: 'photo' | 'video' | 'animated_gif'
  url?: string
  preview_image_url?: string
  width?: number
  height?: number
}
