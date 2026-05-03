import { addFavorite, removeFavorite } from '@/entities/favorite-mems'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  memeId: string
  variant?: 'default' | 'icon'
}

export function FavoriteButton({ memeId, variant = 'default' }: FavoriteButtonProps) {
  const dispatch = useAppDispatch()
  const isFavorite = useAppSelector(state => state.favorites.items.includes(memeId))

  function handleClick() {
    if (isFavorite) {
      dispatch(removeFavorite(memeId))
      return
    }

    dispatch(addFavorite(memeId))
  }

  if (variant === 'icon') {
    const buttonClassName = isFavorite
      ? `${styles['favorite-button']} ${styles['favorite-button--icon']} ${styles['favorite-button--icon-active']}`
      : `${styles['favorite-button']} ${styles['favorite-button--icon']}`

    return (
      <button
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        className={buttonClassName}
        onClick={handleClick}
        title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        type="button"
      >
        <svg
          aria-hidden="true"
          className={styles['favorite-button__icon']}
          viewBox="0 0 24 24"
        >
          <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96L12 2.5Z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      className={isFavorite ? `${styles['favorite-button']} ${styles['favorite-button--active']}` : styles['favorite-button']}
      onClick={handleClick}
      type="button"
    >
      {isFavorite ? 'Убрать из избранного' : 'В избранное'}
    </button>
  )
}
