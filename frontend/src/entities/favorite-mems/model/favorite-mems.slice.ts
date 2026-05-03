import type { RequestStatus } from '@/shared/model/request-status'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { favoriteApiService } from '../api/favorite-mems.api'

interface FavoritesState {
  items: string[]
  status: RequestStatus
}

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
}

export const fetchFavorites = createAsyncThunk<string[]>('favorites/fetch', favoriteApiService.fetchFavorites)
export const addFavorite = createAsyncThunk<string[], string>('favorites/add', favoriteApiService.addFavorite)
export const removeFavorite = createAsyncThunk<string, string>('favorites/remove', async (memeId) => {
  await favoriteApiService.removeFavorite(memeId)
  return memeId
})

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'success'
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((id) => id !== action.payload)
      })
  },
})

export const favoritesReducer = favoritesSlice.reducer
