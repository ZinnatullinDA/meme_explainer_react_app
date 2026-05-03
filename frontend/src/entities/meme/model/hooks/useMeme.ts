import { useAppSelector } from '@/shared/lib/hooks'
import { selectMemeById } from '../meme.selectors'

export function useMeme(id: string | undefined) {
  return useAppSelector(selectMemeById(id))
}
