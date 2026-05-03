import type { ExplanationItem } from '../types/explanation.types'
import type { RootState } from '@/app/store'
import type { RequestStatus } from '@/shared/model/request-status'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { explanationApiService } from '../api/explanation.api'

interface ExplanationsState {
  generationErrorsByMeme: Record<string, string | undefined>
  generationStatusByMeme: Record<string, RequestStatus>
  items: ExplanationItem[]
}

const initialState: ExplanationsState = {
  generationErrorsByMeme: {},
  generationStatusByMeme: {},
  items: [],
}

export const fetchExplanations = createAsyncThunk('explanations/fetch', explanationApiService.fetchExplanations)
export const createExplanation = createAsyncThunk('explanations/create', explanationApiService.createExplanation)
export const updateExplanation = createAsyncThunk('explanations/update', explanationApiService.updateExplanation)
export const deleteExplanation = createAsyncThunk('explanations/delete', explanationApiService.deleteExplanation)
export const generateExplanation = createAsyncThunk('explanations/generate', explanationApiService.generateExplanation, {
  condition: ({ force, memeId }: { force?: boolean; memeId: string }, { getState }) => {
    const state = getState() as RootState
    const hasExplanation = state.explanations.items.some((item: ExplanationItem) => item.memeId === memeId)
    const generationStatus = state.explanations.generationStatusByMeme[memeId]

    if (generationStatus === 'loading') {
      return false
    }

    if (force) {
      return true
    }

    return !hasExplanation
  },
})

const explanationsSlice = createSlice({
  name: 'explanations',
  initialState,
  reducers: {
    upsertExplanation(state, action: { payload: ExplanationItem }) {
      state.items = [action.payload, ...state.items.filter((item) => item.memeId !== action.payload.memeId)]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExplanations.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(createExplanation.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items.filter((item) => item.memeId !== action.payload.memeId)]
      })
      .addCase(generateExplanation.pending, (state, action) => {
        state.generationErrorsByMeme[action.meta.arg.memeId] = undefined
        state.generationStatusByMeme[action.meta.arg.memeId] = 'loading'
      })
      .addCase(generateExplanation.fulfilled, (state, action) => {
        state.generationErrorsByMeme[action.payload.memeId] = undefined
        state.generationStatusByMeme[action.payload.memeId] = 'success'
        state.items = [action.payload, ...state.items.filter((item) => item.memeId !== action.payload.memeId)]
      })
      .addCase(generateExplanation.rejected, (state, action) => {
        state.generationErrorsByMeme[action.meta.arg.memeId] = action.error.message || 'Не удалось получить объяснение'
        state.generationStatusByMeme[action.meta.arg.memeId] = 'error'
      })
      .addCase(updateExplanation.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteExplanation.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const { upsertExplanation } = explanationsSlice.actions
export const explanationsReducer = explanationsSlice.reducer
