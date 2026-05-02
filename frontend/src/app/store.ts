import { configureStore } from '@reduxjs/toolkit'
// import { collectionsReducer } from '@/entities/collection/model/collections-slice'
// import { explanationsReducer } from '@/entities/explanation/model/explanations-slice'
// import { favoritesReducer } from '@/entities/favorite/model/favorites-slice'
// import { memesReducer } from '@/entities/meme'
// import { notesReducer } from '@/entities/note/model/notes-slice'
// import { uiReducer } from '@/features/meme-filters/model/ui-slice'

export const store = configureStore({
  reducer: {
    // memes: memesReducer,
    // favorites: favoritesReducer,
    // explanations: explanationsReducer,
    // notes: notesReducer,
    // collections: collectionsReducer,
    // ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
