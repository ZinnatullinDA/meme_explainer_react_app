import { StarFilled, StarOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
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
  const label = isFavorite ? 'Убрать из избранного' : 'В избранное'

  function handleClick() {
    if (isFavorite) {
      dispatch(removeFavorite(memeId))
      return
    }

    dispatch(addFavorite(memeId))
  }

  if (variant === 'icon') {
    return (
      <Tooltip title={label}>
        <Button
          aria-label={label}
          className={styles['favorite-button--icon']}
          icon={isFavorite ? <StarFilled /> : <StarOutlined />}
          onClick={handleClick}
          shape="circle"
          type={isFavorite ? 'primary' : 'default'}
        />
      </Tooltip>
    )
  }

  return (
    <Button
      icon={isFavorite ? <StarFilled /> : <StarOutlined />}
      onClick={handleClick}
      type={isFavorite ? 'primary' : 'default'}
    >
      {label}
    </Button>
  )
}
