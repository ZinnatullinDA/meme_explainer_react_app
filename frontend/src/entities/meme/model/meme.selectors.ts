import type { MemesState } from './memes.slice'

interface MemesRootState {
  memes: MemesState
}

export function selectMemes(state: MemesRootState) {
  return state.memes.items
}

export function selectMemesStatus(state: MemesRootState) {
  return state.memes.status
}

export function selectMemesError(state: MemesRootState) {
  return state.memes.error
}

export function selectMemeById(id: string | undefined) {
  return (state: MemesRootState) => state.memes.items.find((meme) => meme.id === id)
}
