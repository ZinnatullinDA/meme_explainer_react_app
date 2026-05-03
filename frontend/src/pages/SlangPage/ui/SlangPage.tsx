import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { upsertExplanation } from '@/entities/explanation'
import { fetchMemes, generateSlangMeme, selectMemes, selectMemesStatus } from '@/entities/meme'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { MemeFeed } from '@/widgets/MemeFeed'
import styles from './SlangPage.module.css'

export function SlangPage() {
  const dispatch = useAppDispatch()
  const [term, setTerm] = useState('')
  const memes = useAppSelector(selectMemes)
  const memesStatus = useAppSelector(selectMemesStatus)
  const slangStatus = useAppSelector(state => state.memes.slangStatus)
  const slangError = useAppSelector(state => state.memes.slangError)
  const slangMemes = useMemo(
    () => memes.filter(meme => meme.source === 'GigaChat slang'),
    [memes],
  )

  useEffect(() => {
    if (memesStatus === 'idle') {
      dispatch(fetchMemes())
    }
  }, [dispatch, memesStatus])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTerm = term.trim()

    if (!trimmedTerm || slangStatus === 'loading') {
      return
    }

    const result = await dispatch(generateSlangMeme({ term: trimmedTerm })).unwrap()
    dispatch(upsertExplanation(result.explanation))
    setTerm('')
  }

  return (
    <div className={styles['slang-page']}>
      <section className={styles['slang-page__hero']}>
        <h1 className={styles['slang-page__title']}>
          Сленг
        </h1>
        <p className={styles['slang-page__copy']}>
          Введите мемную фразу или интернет-сленг, а GigaChat соберёт объяснение и картинку в карточку.
        </p>
      </section>

      <form
        className={styles['slang-page__form']}
        onSubmit={handleSubmit}
      >
        <label className={styles['slang-page__field']}>
          <span className={styles['slang-page__eyebrow']}>
            Фраза
          </span>
          <input
            className={styles['slang-page__input']}
            onChange={event => setTerm(event.target.value)}
            placeholder="Например: six seven"
            value={term}
          />
        </label>
        <button
          className={styles['slang-page__button']}
          disabled={slangStatus === 'loading' || !term.trim()}
          type="submit"
        >
          {slangStatus === 'loading' ? 'Объясняем...' : 'Объяснить'}
        </button>
      </form>

      {slangError && (
        <section className={styles['slang-page__panel']}>
          <p className={styles['slang-page__text-muted']}>
            {slangError}
          </p>
        </section>
      )}

      <MemeFeed
        memes={slangMemes}
        title="Сленговые карточки"
      />
    </div>
  )
}
