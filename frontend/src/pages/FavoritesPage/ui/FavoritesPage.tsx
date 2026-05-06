import { Typography } from 'antd'
import { useEffect } from 'react'
import { fetchMemes, selectMemesStatus } from '@/entities/meme'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { MemeFeed } from '@/widgets/MemeFeed'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const dispatch = useAppDispatch()
  const memesStatus = useAppSelector(selectMemesStatus)
  const favorites = useAppSelector(state => state.favorites.items)
  const memes = useAppSelector(state => state.memes.items.filter(meme => favorites.includes(meme.id)))

  useEffect(() => {
    if (memesStatus === 'idle') {
      dispatch(fetchMemes())
    }
  }, [dispatch, memesStatus])

  return (
    <div className={styles['favorites-page']}>
      <section className={styles['favorites-page__hero']}>
        <Typography.Title
          className={styles['favorites-page__title']}
          level={1}
        >
          Избранные мемы
        </Typography.Title>
      </section>
      <MemeFeed
        memes={memes}
        title="Ваше избранное"
      />
    </div>
  )
}
