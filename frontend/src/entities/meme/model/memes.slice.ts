import type { Meme } from '../types/meme.types'
import type { RequestStatus } from '@/shared/model/request-status'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { memeApiService } from '../api/meme.api'

export interface MemesState {
  items: Meme[]
  slangError: string | null
  slangStatus: RequestStatus
  status: RequestStatus
  error: string | null
}

const initialState: MemesState = {
  items: [],
  slangError: null,
  slangStatus: 'idle',
  status: 'idle',
  error: null,
}

export const fetchMemes = createAsyncThunk('memes/fetchMemes', memeApiService.fetchMemes)
export const fetchRandomMemes = createAsyncThunk('memes/fetchRandomMemes', memeApiService.fetchRandomMemes)
export const fetchMemesBySubreddit = createAsyncThunk('memes/fetchMemesBySubreddit', memeApiService.fetchMemesBySubreddit)
export const generateSlangMeme = createAsyncThunk('memes/generateSlangMeme', memeApiService.generateSlangMeme)

const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.status = 'success'
        state.items = action.payload
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Failed to load memes'
      })
      .addCase(fetchRandomMemes.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRandomMemes.fulfilled, (state, action) => {
        state.status = 'success'
        state.items = action.payload
      })
      .addCase(fetchRandomMemes.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Failed to load random meme'
      })
      .addCase(fetchMemesBySubreddit.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMemesBySubreddit.fulfilled, (state, action) => {
        state.status = 'success'
        state.items = action.payload
      })
      .addCase(fetchMemesBySubreddit.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Failed to load subreddit memes'
      })
      .addCase(generateSlangMeme.pending, (state) => {
        state.slangStatus = 'loading'
        state.slangError = null
      })
      .addCase(generateSlangMeme.fulfilled, (state, action) => {
        state.slangStatus = 'success'
        state.slangError = null
        state.items = [action.payload.meme, ...state.items.filter((item) => item.id !== action.payload.meme.id)]
      })
      .addCase(generateSlangMeme.rejected, (state, action) => {
        state.slangStatus = 'error'
        state.slangError = action.error.message ?? 'Failed to explain slang'
      })
  },
})

export const memesReducer = memesSlice.reducer
