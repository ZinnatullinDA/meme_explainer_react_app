import { Link } from '@tanstack/react-router'
import { Card, Empty, Space, Tag, Typography } from 'antd'
import { ROUTES } from '@/shared/config/routes'
import { useAppSelector } from '@/shared/lib/hooks'
import styles from './CollectionPage.module.css'

export function CollectionsPage() {
  const collections = useAppSelector(state => state.collections.items)
  const memes = useAppSelector(state => state.memes.items)

  return (
    <div className={styles['collections-page']}>
      <section className={styles['collections-page__hero']}>
        <Typography.Title
          className={styles['collections-page__title']}
          level={1}
        >
          Подборки
        </Typography.Title>
      </section>

      <div className={styles['collections-page__grid']}>
        {collections.length === 0 && (
          <Card className={styles['collections-page__card']}>
            <Empty description="Создайте подборку на странице деталей любого мема" />
          </Card>
        )}

        {collections.map(collection => (
          <Card
            className={styles['collections-page__card']}
            key={collection.id}
            title={collection.name}
          >
            <Typography.Text type="secondary">
              {new Date(collection.updatedAt).toLocaleDateString('ru-RU')}
            </Typography.Text>
            <Typography.Paragraph className={styles['collections-page__text-muted']}>
              {collection.description || 'Описание пока не добавлено.'}
            </Typography.Paragraph>
            <Space wrap>
              {collection.memeIds.length === 0 && (
                <Tag>
                  Мемов пока нет
                </Tag>
              )}
              {collection.memeIds.map((memeId) => {
                const meme = memes.find(item => item.id === memeId)
                return (
                  <Link
                    key={memeId}
                    params={{ id: memeId }}
                    to={ROUTES.memeDetails}
                  >
                    <Tag color="blue">
                      {meme?.title ?? memeId}
                    </Tag>
                  </Link>
                )
              })}
            </Space>
          </Card>
        ))}
      </div>
    </div>
  )
}
