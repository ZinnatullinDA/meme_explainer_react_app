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

  return (
    <section className={styles['meme-filters']}>
      <div className={styles['meme-filters__row']}>
        <label className={styles['meme-filters__field']}>
          <span>
            Поиск
          </span>
          <Input.Search
            allowClear
            onChange={event => setSearchValue(event.target.value)}
            placeholder="Например, Drake"
            value={searchValue}
          />
        </label>

        <label className={styles['meme-filters__field']}>
          <span>
            Источник
          </span>
          <Select
            onChange={(value) => {
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
            options={[
              { label: 'Все мемы', value: 'all' },
              { label: 'Случайный мем', value: 'random' },
              { label: 'r/memes', value: 'memes' },
              { label: 'r/dankmemes', value: 'dankmemes' },
              { label: 'r/ProgrammerHumor', value: 'ProgrammerHumor' },
            ]}
            value={subreddit}
          />
        </label>
      </div>

      <Checkbox
        checked={onlyFavorites}
        onChange={event => dispatch(setOnlyFavorites(event.target.checked))}
      >
        Показывать только избранное
      </Checkbox>
    </section>
  )
}
