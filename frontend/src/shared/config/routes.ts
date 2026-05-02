export const ROUTES = {
  home: '/',
  memeDetails: '/memes/$id',
  slang: '/slang',
  favorites: '/favorites',
  collections: '/collections',
} as const

export const MEME_LIST_ROUTES = [
  ROUTES.home,
  ROUTES.slang,
  ROUTES.favorites,
  ROUTES.collections,
] as const

export type MemeListRoute = (typeof MEME_LIST_ROUTES)[number]
