import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { generateExplanation } from '@/entities/explanation'
import { fetchMemes, selectMemeById, selectMemesStatus } from '@/entities/meme'
import { ROUTES } from '@/shared/config/routes'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { MemeDetails } from '@/widgets/MemeDetails'
import styles from './MemeDetailsPage.module.css'

export function MemeDetailsPage() {
  const dispatch = useAppDispatch()
  const { id } = useParams({ from: ROUTES.memeDetails })
  const meme = useAppSelector(selectMemeById(id))
  const memesStatus = useAppSelector(selectMemesStatus)

  useEffect(() => {
    if (memesStatus === 'idle') {
      dispatch(fetchMemes())
    }
  }, [dispatch, memesStatus])

  useEffect(() => {
    if (!meme) {
      return
    }

    dispatch(generateExplanation({ memeId: meme.id, title: meme.title }))
  }, [dispatch, meme])

  if (!meme) {
    return (
      <section className={`${styles['meme-details-page']} ${styles['meme-details-page__panel']}`}>
        <h1 className={styles['meme-details-page__title']}>
          Мем не найден
        </h1>
        <p className={styles['meme-details-page__text-muted']}>
          Скорее всего, список ещё не загрузился или ссылка устарела.
        </p>
      </section>
    )
  }

  return (
    <div className={styles['meme-details-page']}>
      <MemeDetails meme={meme} />
    </div>
  )
}
