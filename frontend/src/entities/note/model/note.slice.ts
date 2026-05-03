import type { NoteItem } from '../types/note.types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { noteApiService } from '../api/note.api'

interface NotesState {
  items: NoteItem[]
}

const initialState: NotesState = {
  items: [],
}

export const fetchNotes = createAsyncThunk('notes/fetch', noteApiService.fetchNotes)
export const createNote = createAsyncThunk('notes/create', noteApiService.createNote)
export const updateNote = createAsyncThunk('notes/update', noteApiService.updateNote)
export const deleteNote = createAsyncThunk('notes/delete', noteApiService.deleteNote)

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items.filter((item) => item.memeId !== action.payload.memeId)]
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const notesReducer = notesSlice.reducer
