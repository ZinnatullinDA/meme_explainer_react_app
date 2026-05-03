import { useEffect } from 'react'
import { fetchMemes, selectMemes, selectMemesStatus } from '@/entities/meme'
import { FilterMeme } from '@/features/meme'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useFilters } from '@/shared/lib/use-filters'
import { MemeFeed } from '@/widgets/MemeFeed'
import styles from './HomePage.module.css'

export function HomePage() {
  const dispatch = useAppDispatch()
  const memes = useAppSelector(selectMemes)
  const status = useAppSelector(selectMemesStatus)
  const favorites = useAppSelector(state => state.favorites.items)
  const filters = useAppSelector(state => state.memeFilter)
  const filteredMemes = useFilters(memes, filters, favorites)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMemes())
    }
  }, [dispatch, status])

  return (
    <div className={styles['home-page']}>
      <section className={styles['home-page__hero']}>
        <h1 className={styles['home-page__title']}>
          Meme Explainer
        </h1>
        <p className={styles['home-page__copy']}>
          Приложение показывает мемы, объясняет их человеческим языком и помогает сохранять контекст в избранном,
          заметках и подборках.
        </p>
      </section>

      <FilterMeme />

      {status === 'loading' && (
        <div className={styles['home-page__panel']}>
          Загружаем мемы...
        </div>
      )}
      {status !== 'loading' && (
        <MemeFeed
          memes={filteredMemes}
          title="Лента мемов"
        />
      )}
    </div>
  )
}
