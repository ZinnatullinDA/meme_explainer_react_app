import type { Meme } from '@/entities/meme'
import { Link } from '@tanstack/react-router'
import { Card, Empty, Pagination, Tag } from 'antd'
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
        <Tag color="blue">
          {memes.length}
          {' '}
          шт.
        </Tag>
      </div>

      {paginatedItems.length === 0 && (
        <Card>
          <Empty description="Мемы не найдены" />
        </Card>
      )}

      <div className={styles['meme-feed__grid']}>
        {paginatedItems.map(meme => (
          <Card
            className={styles['meme-feed__card']}
            cover={(
              <Link
                params={{ id: meme.id }}
                to={ROUTES.memeDetails}
              >
                <img
                  alt={meme.title}
                  className={styles['meme-feed__image']}
                  loading="lazy"
                  src={meme.url}
                />
              </Link>
            )}
            hoverable
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
              <p className={styles['meme-feed__eyebrow']}>
                {meme.source}
              </p>
              <h3>
                {meme.title}
              </h3>
            </Link>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          align="center"
          current={page}
          onChange={setPage}
          pageSize={8}
          showSizeChanger={false}
          total={memes.length}
        />
      )}
    </section>
  )
}
