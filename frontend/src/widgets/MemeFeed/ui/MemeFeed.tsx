import type { Meme } from '@/entities/meme'
import { Link } from '@tanstack/react-router'
import { FavoriteButton } from '@/features/favorite-mems'
import { ROUTES } from '@/shared/config/routes'
import { usePagination } from '@/shared/lib/use-pagination'
import styles from './MemeFeed.module.css'

interface MemeFeedProps {
  memes: Meme[]
  title: string
}

export function MemeFeed({ memes, title }: MemeFeedProps) {
  const { page, paginatedItems, setPage, totalPages } = usePagination(memes)

  return (
    <section className={styles['meme-feed']}>
      <div className={styles['meme-feed__heading']}>
        <h2>
          {title}
        </h2>
        <span className={styles['meme-feed__badge']}>
          {memes.length}
          {' '}
          шт.
        </span>
      </div>

      <div className={styles['meme-feed__grid']}>
        {paginatedItems.map(meme => (
          <article
            className={styles['meme-feed__card']}
            key={meme.id}
          >
            <FavoriteButton
              memeId={meme.id}
              variant="icon"
            />
            <Link
              className={styles['meme-feed__card-link']}
              params={{ id: meme.id }}
              to={ROUTES.memeDetails}
            >
              <img
                alt={meme.title}
                className={styles['meme-feed__image']}
                loading="lazy"
                src={meme.url}
              />
              <div className={styles['meme-feed__body']}>
                <div>
                  <p className={styles['meme-feed__eyebrow']}>
                    {meme.source}
                  </p>
                  <h3>
                    {meme.title}
                  </h3>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className={styles['meme-feed__pagination']}>
        <button
          className={styles['meme-feed__button']}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          type="button"
        >
          Назад
        </button>
        <span className={styles['meme-feed__page-info']}>
          Страница
          {page}
          {' '}
          из
          {totalPages}
        </span>
        <button
          className={styles['meme-feed__button']}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          type="button"
        >
          Вперёд
        </button>
      </div>
    </section>
  )
}
