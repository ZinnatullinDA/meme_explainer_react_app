import { configureStore } from '@reduxjs/toolkit'
import { collectionsReducer } from '@/entities/collection'
import { explanationsReducer } from '@/entities/explanation'
import { favoritesReducer } from '@/entities/favorite-mems'
import { memesReducer } from '@/entities/meme'
import { notesReducer } from '@/entities/note'
import { memeFilterReducer } from '@/features/meme'

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    favorites: favoritesReducer,
    explanations: explanationsReducer,
    notes: notesReducer,
    collections: collectionsReducer,
    memeFilter: memeFilterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
