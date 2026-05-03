import { useAppSelector } from '@/shared/lib/hooks'
import { selectMemes, selectMemesError, selectMemesStatus } from '../meme.selectors'

export function useMemes() {
  return useAppSelector(selectMemes)
}

export function useMemesStatus() {
  return useAppSelector(selectMemesStatus)
}

export function useMemesError() {
  return useAppSelector(selectMemesError)
}
