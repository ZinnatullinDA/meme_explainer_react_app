import { useState } from 'react'
import { createCollection, toggleCollectionMeme } from '@/entities/collection'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import styles from './CollectionManager.module.css'

interface CollectionManagerProps {
  memeId: string
}

export function CollectionManager({ memeId }: CollectionManagerProps) {
  const dispatch = useAppDispatch()
  const collections = useAppSelector(state => state.collections.items)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <section className={styles['collection-manager']}>
      <h3 className={styles['collection-manager__title']}>
        Подборки
      </h3>

      <div className={styles['collection-manager__form']}>
        <input
          className={styles['collection-manager__input']}
          onChange={event => setName(event.target.value)}
          placeholder="Название подборки"
          value={name}
        />
        <input
          className={styles['collection-manager__input']}
          onChange={event => setDescription(event.target.value)}
          placeholder="Короткое описание"
          value={description}
        />
        <button
          className={styles['collection-manager__button']}
          onClick={() => {
            if (!name.trim()) {
              return
            }

            dispatch(createCollection({ description, name }))
            setDescription('')
            setName('')
          }}
          type="button"
        >
          Создать подборку
        </button>
      </div>

      <div className={styles['collection-manager__chips']}>
        {collections.length === 0 && (
          <p className={styles['collection-manager__text-muted']}>
            Пока нет подборок. Создайте первую прямо здесь.
          </p>
        )}
        {collections.map(collection => (
          <button
            className={collection.memeIds.includes(memeId) ? `${styles['collection-manager__chip']} ${styles['collection-manager__chip--active']}` : styles['collection-manager__chip']}
            key={collection.id}
            onClick={() => dispatch(toggleCollectionMeme({ collectionId: collection.id, memeId }))}
            type="button"
          >
            {collection.name}
          </button>
        ))}
      </div>
    </section>
  )
}
