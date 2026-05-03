import { useEffect, useState } from 'react'
import { fetchMemes, fetchMemesBySubreddit, fetchRandomMemes } from '@/entities/meme'
import { setOnlyFavorites, setSearch, setSubreddit } from '@/features/meme/model/meme-filter.slice'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useDebounce } from '@/shared/lib/use-debounce'
import styles from './FilterMeme.module.css'

export function FilterMeme() {
  const dispatch = useAppDispatch()
  const { onlyFavorites, search, subreddit } = useAppSelector((state) => state.memeFilter)
  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 250)

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  return (
    <section className={styles['meme-filters']}>
      <div className={styles['meme-filters__row']}>
        <label className={styles['meme-filters__field']}>
          <span>Поиск</span>
          <input
            className={styles['meme-filters__input']}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Например, Drake"
            value={searchValue}
          />
        </label>

        <label className={styles['meme-filters__field']}>
          <span>Источник</span>
          <select
            className={styles['meme-filters__input']}
            onChange={(event) => {
              const value = event.target.value
              dispatch(setSubreddit(value))

              if (value === 'all') {
                dispatch(fetchMemes())
                return
              }

              if (value === 'random') {
                dispatch(fetchRandomMemes())
                return
              }

              dispatch(fetchMemesBySubreddit(value))
            }}
            value={subreddit}
          >
            <option value="all">Все мемы</option>
            <option value="random">Случайный мем</option>
            <option value="memes">r/memes</option>
            <option value="dankmemes">r/dankmemes</option>
            <option value="ProgrammerHumor">r/ProgrammerHumor</option>
          </select>
        </label>
      </div>

      <label className={styles['meme-filters__toggle']}>
        <input checked={onlyFavorites} onChange={(event) => dispatch(setOnlyFavorites(event.target.checked))} type="checkbox" />
        <span>Показывать только избранное</span>
      </label>
    </section>
  )
}
