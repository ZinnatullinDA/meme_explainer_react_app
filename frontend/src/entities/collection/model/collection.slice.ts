import type { CollectionItem } from '../types/collection.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collectionApiService } from '../api/collection.api'

interface CollectionsState {
  items: CollectionItem[]
}

const initialState: CollectionsState = {
  items: [],
}

export const fetchCollections = createAsyncThunk('collections/fetch', collectionApiService.fetchCollections)
export const createCollection = createAsyncThunk('collections/create', collectionApiService.createCollection)
export const toggleCollectionMeme = createAsyncThunk('collections/toggleMeme', collectionApiService.toggleCollectionMeme)

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(toggleCollectionMeme.fulfilled, (state, action) => {
        state.items = state.items.map((collection) => (collection.id === action.payload.id ? action.payload : collection))
      })
  },
})

export const collectionsReducer = collectionSlice.reducer
