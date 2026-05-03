import type { CreateNoteRequest, NoteItem, UpdateNoteRequest } from '../types/note.types'
import { makeRequest } from '@/shared/api/make-request'
import { ENDPOINTS } from '../config/note.config'

export const noteApiService = {
  fetchNotes(): Promise<NoteItem[]> {
    return makeRequest<NoteItem[]>({
      url: ENDPOINTS.NOTE,
      method: 'GET',
    })
  },

  createNote(payload: CreateNoteRequest): Promise<NoteItem> {
    return makeRequest<NoteItem>({
      url: ENDPOINTS.NOTE,
      method: 'POST',
      data: payload,
    })
  },

  updateNote(payload: UpdateNoteRequest): Promise<NoteItem> {
    return makeRequest<NoteItem>({
      url: `${ENDPOINTS.NOTE}/${payload.id}`,
      method: 'PUT',
      data: payload,
    })
  },

  deleteNote(id: string): Promise<string> {
    return makeRequest<string>({
      url: `${ENDPOINTS.NOTE}/${id}`,
      method: 'DELETE',
    })
  },
}
