import { useEffect } from 'react'
import { AppRouter } from '@/app/router'
import { fetchCollections } from '@/entities/collection'
import { fetchExplanations } from '@/entities/explanation'
import { fetchFavorites } from '@/entities/favorite-mems'
import { fetchNotes } from '@/entities/note'
import { useAppDispatch } from '@/shared/lib/hooks'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchFavorites())
    dispatch(fetchExplanations())
    dispatch(fetchNotes())
    dispatch(fetchCollections())
  }, [dispatch])

  return <AppRouter />
}
