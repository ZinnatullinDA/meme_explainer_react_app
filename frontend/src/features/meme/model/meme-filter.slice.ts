import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface MemeFilterState {
  search: string
  subreddit: string
  onlyFavorites: boolean
}

const initialState: MemeFilterState = {
  search: '',
  subreddit: 'all',
  onlyFavorites: false,
}

const memeFilterSlice = createSlice({
  name: 'memeFilter',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setSubreddit: (state, action: PayloadAction<string>) => {
      state.subreddit = action.payload
    },
    setOnlyFavorites: (state, action: PayloadAction<boolean>) => {
      state.onlyFavorites = action.payload
    },
  },
})

export const { setOnlyFavorites, setSearch, setSubreddit } = memeFilterSlice.actions
export const memeFilterReducer = memeFilterSlice.reducer
