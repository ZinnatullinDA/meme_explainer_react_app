import { useState } from 'react'
import { createExplanation, deleteExplanation, generateExplanation, updateExplanation } from '@/entities/explanation'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import styles from './ExplanationEditor.module.css'

interface ExplanationEditorProps {
  memeId: string
  placeholder: string
  title: string
}

export function ExplanationEditor({ memeId, placeholder, title }: ExplanationEditorProps) {
  const dispatch = useAppDispatch()
  const explanation = useAppSelector(state => state.explanations.items.find(item => item.memeId === memeId))
  const generationError = useAppSelector(state => state.explanations.generationErrorsByMeme[memeId])
  const generationStatus = useAppSelector(state => state.explanations.generationStatusByMeme[memeId] ?? 'idle')
  const sourceContent = explanation?.content ?? placeholder
  const [draft, setDraft] = useState({ content: sourceContent, source: sourceContent })
  const content = draft.source !== sourceContent && draft.content === draft.source
    ? sourceContent
    : draft.content

  return (
    <section className={styles['explanation-editor']}>
      <div className={styles['explanation-editor__heading']}>
        <h3 className={styles['explanation-editor__title']}>
          Объяснение
        </h3>
        {explanation && (
          <button
            className={styles['explanation-editor__link-button']}
            onClick={() => dispatch(deleteExplanation(explanation.id))}
            type="button"
          >
            Удалить
          </button>
        )}
      </div>

      <textarea
        className={styles['explanation-editor__textarea']}
        onChange={event => setDraft({ content: event.target.value, source: sourceContent })}
        placeholder={placeholder}
        rows={6}
        value={content}
      />

      {generationStatus === 'loading' && (
        <p className={styles['explanation-editor__text-muted']}>
          Объяснение генерируется через GigaChat...
        </p>
      )}

      {generationError && (
        <p className={styles['explanation-editor__text-muted']}>
          {generationError}
        </p>
      )}

      <div className={styles['explanation-editor__actions']}>
        <button
          className={`${styles['explanation-editor__button']} ${styles['explanation-editor__button--ghost']}`}
          disabled={generationStatus === 'loading'}
          onClick={() => dispatch(generateExplanation({ force: true, memeId, title }))}
          type="button"
        >
          Перегенерировать объяснение
        </button>

        <button
          className={`${styles['explanation-editor__button']} ${styles['explanation-editor__button--accent']}`}
          onClick={() => {
            if (!content.trim()) {
              return
            }

            if (explanation) {
              dispatch(updateExplanation({ content, id: explanation.id }))
              return
            }

            dispatch(createExplanation({ content, memeId }))
          }}
          type="button"
        >
          {explanation ? 'Обновить объяснение' : 'Сохранить объяснение'}
        </button>
      </div>
    </section>
  )
}
