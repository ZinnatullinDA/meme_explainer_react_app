import { Spin, Typography } from 'antd'
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
        <Typography.Title
          className={styles['home-page__title']}
          level={1}
        >
          Meme Explainer
        </Typography.Title>
        <Typography.Paragraph className={styles['home-page__copy']}>
          Приложение показывает мемы, объясняет их человеческим языком и помогает сохранять контекст в избранном, заметках и подборках.
        </Typography.Paragraph>
      </section>

      <FilterMeme />

      {status === 'loading' && (
        <div className={styles['home-page__panel']}>
          <Spin description="Загружаем мемы..." />
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
