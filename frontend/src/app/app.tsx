import { useEffect } from 'react'
import { AppRouter } from '@/app/router'
// import { fetchCollections } from '@/entities/collection/model/collections-slice'
// import { fetchExplanations } from '@/entities/explanation/model/explanations-slice'
// import { fetchFavorites } from '@/entities/favorite/model/favorites-slice'
// import { fetchNotes } from '@/entities/note/model/notes-slice'
import { useAppDispatch } from '@/shared/lib/hooks'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // dispatch(fetchFavorites())
    // dispatch(fetchExplanations())
    // dispatch(fetchNotes())
    // dispatch(fetchCollections())
  }, [dispatch])

  return <AppRouter />
}
