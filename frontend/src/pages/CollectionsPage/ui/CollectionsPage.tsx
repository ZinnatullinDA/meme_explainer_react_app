import { Link } from '@tanstack/react-router'
import { ROUTES } from '@/shared/config/routes'
import { useAppSelector } from '@/shared/lib/hooks'
import styles from './CollectionPage.module.css'

export function CollectionsPage() {
  const collections = useAppSelector(state => state.collections.items)
  const memes = useAppSelector(state => state.memes.items)

  return (
    <div className={styles['collections-page']}>
      <section className={styles['collections-page__hero']}>
        <h1 className={styles['collections-page__title']}>
          Подборки
        </h1>
      </section>

      <div className={styles['collections-page__grid']}>
        {collections.length === 0 && (
          <section className={styles['collections-page__card']}>
            <h2 className={styles['collections-page__card-title']}>
              Пока пусто
            </h2>
            <p className={styles['collections-page__text-muted']}>
              Создайте подборку на странице деталей любого мема.
            </p>
          </section>
        )}

        {collections.map(collection => (
          <section
            className={styles['collections-page__card']}
            key={collection.id}
          >
            <p className={styles['collections-page__eyebrow']}>
              {new Date(collection.updatedAt).toLocaleDateString('ru-RU')}
            </p>
            <h2 className={styles['collections-page__card-title']}>
              {collection.name}
            </h2>
            <p className={styles['collections-page__text-muted']}>
              {collection.description || 'Описание пока не добавлено.'}
            </p>
            <div className={styles['collections-page__chips']}>
              {collection.memeIds.length === 0 && (
                <span className={styles['collections-page__badge']}>
                  Мемов пока нет
                </span>
              )}
              {collection.memeIds.map((memeId) => {
                const meme = memes.find(item => item.id === memeId)
                return (
                  <Link
                    className={`${styles['collections-page__chip']} ${styles['collections-page__chip--active']}`}
                    key={memeId}
                    params={{ id: memeId }}
                    to={ROUTES.memeDetails}
                  >
                    {meme?.title ?? memeId}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
