import { configureStore } from '@reduxjs/toolkit'
import { collectionsReducer } from '@/entities/collection'
import { explanationsReducer } from '@/entities/explanation'
import { favoritesReducer } from '@/entities/favorite-mems'
import { memesReducer } from '@/entities/meme'
import { notesReducer } from '@/entities/note'
// import { uiReducer } from '@/features/meme-filters/model/ui-slice'

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    favorites: favoritesReducer,
    explanations: explanationsReducer,
    notes: notesReducer,
    collections: collectionsReducer,
    // ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
