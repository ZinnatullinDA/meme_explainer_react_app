import type { Meme } from '@/entities/meme'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CollectionManager } from '@/features/collection'
import { ExplanationEditor } from '@/features/explanation'
import { FavoriteButton } from '@/features/favorite-mems'
import { NoteEditor } from '@/features/note'
import { getLastMemeListRoute } from '@/shared/lib/meme-list-route'
import styles from './MemeDetails.module.css'

interface MemeDetailsProps {
  meme: Meme
}

export function MemeDetails({ meme }: MemeDetailsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [backRoute] = useState(getLastMemeListRoute)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const shareLinks = useMemo(() => {
    const encodedTitle = encodeURIComponent(meme.title)
    const encodedUrl = encodeURIComponent(meme.url)

    return {
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&image=${encodedUrl}`,
    }
  }, [meme.title, meme.url])

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(meme.url)
    setIsCopied(true)
    setIsShareOpen(false)
    window.setTimeout(setIsCopied, 1800, false)
  }

  useEffect(() => {
    if (!isShareOpen) {
      return
    }

    function handleDocumentPointerDown(event: PointerEvent) {
      if (shareMenuRef.current?.contains(event.target as Node)) {
        return
      }

      setIsShareOpen(false)
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsShareOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown)
    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [isShareOpen])

  return (
    <section className={styles['meme-details']}>
      <article className={styles['meme-details__hero']}>
        <p className={styles['meme-details__eyebrow']}>
          {meme.source}
        </p>
        <h1 className={styles['meme-details__title']}>
          {meme.title}
        </h1>
        <p className={styles['meme-details__copy']}>
          Объяснение мема подгружается автоматически при открытии страницы. При желании его можно поправить вручную.
        </p>
        <div className={styles['meme-details__actions']}>
          <FavoriteButton memeId={meme.id} />
          <div
            className={styles['meme-details__share']}
            ref={shareMenuRef}
          >
            <button
              aria-expanded={isShareOpen}
              className={`${styles['meme-details__button']} ${styles['meme-details__button--ghost']} ${styles['meme-details__share-toggle']}`}
              onClick={() => setIsShareOpen(current => !current)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={styles['meme-details__share-arrow']}
              >
                ↗
              </span>
              Поделиться
            </button>
            {isShareOpen && (
              <div className={styles['meme-details__share-dropdown']}>
                <a
                  className={styles['meme-details__share-option']}
                  href={shareLinks.vk}
                  onClick={() => setIsShareOpen(false)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className={`${styles['meme-details__share-icon']} ${styles['meme-details__share-icon--vk']}`}>
                    VK
                  </span>
                  ВКонтакте
                </a>
                <a
                  className={styles['meme-details__share-option']}
                  href={shareLinks.telegram}
                  onClick={() => setIsShareOpen(false)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className={`${styles['meme-details__share-icon']} ${styles['meme-details__share-icon--telegram']}`}>
                    TG
                  </span>
                  Telegram
                </a>
                <button
                  className={styles['meme-details__share-option']}
                  onClick={handleCopyLink}
                  type="button"
                >
                  <span className={`${styles['meme-details__share-icon']} ${styles['meme-details__share-icon--link']}`}>
                    URL
                  </span>
                  {isCopied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
                </button>
              </div>
            )}
          </div>
          <Link
            className={styles['meme-details__button']}
            to={backRoute}
          >
            К списку
          </Link>
        </div>
        <a
          className={styles['meme-details__image-link']}
          href={meme.url}
          rel="noreferrer"
          target="_blank"
          title="Открыть изображение"
        >
          <img
            alt={meme.title}
            className={styles['meme-details__image']}
            src={meme.url}
          />
        </a>
      </article>

      <div className={styles['meme-details__side']}>
        <ExplanationEditor
          memeId={meme.id}
          placeholder="Объяснение появится здесь после ответа GigaChat."
          title={meme.title}
        />
        <NoteEditor memeId={meme.id} />
        <CollectionManager memeId={meme.id} />
      </div>
    </section>
  )
}
