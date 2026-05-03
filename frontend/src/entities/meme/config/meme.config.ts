import { DEFAULT_SUBREDDIT } from '@/shared/config/app'

export const ENDPOINTS = {
  IMGFLIP: 'https://api.imgflip.com/get_memes',
  RANDOM: 'https://meme-api.com/gimme',
  SUBREDDIT: (subreddit = DEFAULT_SUBREDDIT) => `https://meme-api.com/gimme/${subreddit}/12`,
  SLANG: '/api/slang',
}
