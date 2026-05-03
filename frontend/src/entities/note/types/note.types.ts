export interface NoteItem {
  id: string
  memeId: string
  content: string
  updatedAt: string
}

export interface CreateNoteRequest {
  content: string
  memeId: string
}

export interface UpdateNoteRequest {
  content: string
  id: string
}
