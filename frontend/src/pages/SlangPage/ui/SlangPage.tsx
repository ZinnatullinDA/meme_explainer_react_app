import type { ChangeEvent, FormEvent } from 'react'
import { Alert, Button, Input, Space, Typography } from 'antd'
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

  function handleTermChange(event: ChangeEvent<HTMLInputElement>) {
    setTerm(event.target.value)
  }

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
        <Typography.Title
          className={styles['slang-page__title']}
          level={1}
        >
          Сленг
        </Typography.Title>
        <Typography.Paragraph className={styles['slang-page__copy']}>
          Введите мемную фразу или интернет-сленг, а GigaChat соберет объяснение и картинку в карточку.
        </Typography.Paragraph>
      </section>

      <form
        className={styles['slang-page__form']}
        onSubmit={handleSubmit}
      >
        <Space.Compact className={styles['slang-page__compact']}>
          <Input
            onChange={handleTermChange}
            placeholder="Например: six seven"
            value={term}
          />
          <Button
            disabled={slangStatus === 'loading' || !term.trim()}
            htmlType="submit"
            loading={slangStatus === 'loading'}
            type="primary"
          >
            Объяснить
          </Button>
        </Space.Compact>
      </form>

      {slangError && (
        <Alert
          message={slangError}
          showIcon
          type="warning"
        />
      )}

      <MemeFeed
        memes={slangMemes}
        title="Сленговые карточки"
      />
    </div>
  )
}
