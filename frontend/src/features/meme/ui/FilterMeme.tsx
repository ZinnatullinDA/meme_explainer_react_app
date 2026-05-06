import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { ChangeEvent } from 'react'
import { Checkbox, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { fetchMemes, fetchMemesBySubreddit, fetchRandomMemes } from '@/entities/meme'
import { setOnlyFavorites, setSearch, setSubreddit } from '@/features/meme/model/meme-filter.slice'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { useDebounce } from '@/shared/lib/use-debounce'
import styles from './FilterMeme.module.css'

export function FilterMeme() {
  const dispatch = useAppDispatch()
  const { onlyFavorites, search, subreddit } = useAppSelector(state => state.memeFilter)
  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 250)

  useEffect(() => {
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value)
  }

  function handleSubredditChange(value: string) {
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
  }

  function handleOnlyFavoritesChange(event: CheckboxChangeEvent) {
    dispatch(setOnlyFavorites(event.target.checked))
  }

  return (
    <section className={styles['meme-filters']}>
      <div className={styles['meme-filters__row']}>
        <label className={styles['meme-filters__field']}>
          <span>
            Поиск
          </span>
          <Input.Search
            allowClear
            onChange={handleSearchChange}
            placeholder="Например, Drake"
            value={searchValue}
          />
        </label>

        <label className={styles['meme-filters__field']}>
          <span>
            Источник
          </span>
          <Select
            onChange={handleSubredditChange}
            options={[
              { label: 'Все мемы', value: 'all' },
              { label: 'Случайный мем', value: 'random' },
              { label: 'memes', value: 'memes' },
              { label: 'dankmemes', value: 'dankmemes' },
              { label: 'ProgrammerHumor', value: 'ProgrammerHumor' },
            ]}
            value={subreddit}
          />
        </label>
      </div>

      <Checkbox
        checked={onlyFavorites}
        onChange={handleOnlyFavoritesChange}
      >
        Показывать только избранное
      </Checkbox>
    </section>
  )
}
