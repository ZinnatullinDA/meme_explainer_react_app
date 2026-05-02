import type { Meme } from '@/entities/meme'
import { useMemo } from 'react'

interface MemeFilters {
  search: string
  subreddit: string
  onlyFavorites: boolean
}

export function useFilters(memes: Meme[], filters: MemeFilters, favoriteIds: string[]) {
  return useMemo(() => {
    return memes.filter((meme) => {
      const matchesSearch =
        filters.search.trim() === '' ||
        `${meme.title} ${meme.source}`.toLowerCase().includes(filters.search.toLowerCase())
      const matchesSubreddit =
        filters.subreddit === 'all' ||
        filters.subreddit === 'random' ||
        meme.source.toLowerCase().includes(filters.subreddit.toLowerCase())
      const matchesFavorites = !filters.onlyFavorites || favoriteIds.includes(meme.id)

      return matchesSearch && matchesSubreddit && matchesFavorites
    })
  }, [favoriteIds, filters, memes])
}
