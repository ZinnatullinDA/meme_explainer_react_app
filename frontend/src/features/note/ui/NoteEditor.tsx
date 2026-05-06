import { useState } from 'react'
import { createNote, deleteNote, updateNote } from '@/entities/note'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import styles from './NoteEditor.module.css'

interface NoteEditorProps {
  memeId: string
}

export function NoteEditor({ memeId }: NoteEditorProps) {
  const dispatch = useAppDispatch()
  const note = useAppSelector(state => state.notes.items.find(item => item.memeId === memeId))
  const [deletedNoteId, setDeletedNoteId] = useState<string | null>(null)
  const activeNote = note?.id === deletedNoteId ? undefined : note
  const sourceContent = activeNote?.content ?? ''
  const sourceKey = `${memeId}:${activeNote?.id ?? 'new'}:${sourceContent}`
  const [draft, setDraft] = useState({ content: sourceContent, sourceKey })
  const content = draft.sourceKey === sourceKey ? draft.content : sourceContent

  return (
    <section className={styles['note-editor']}>
      <div className={styles['note-editor__heading']}>
        <h3 className={styles['note-editor__title']}>
          Личные заметки
        </h3>
        {activeNote && (
          <button
            className={styles['note-editor__link-button']}
            onClick={() => {
              setDeletedNoteId(activeNote.id)
              setDraft({ content: '', sourceKey: `${memeId}:new:` })
              dispatch(deleteNote(activeNote.id))
            }}
            type="button"
          >
            Удалить
          </button>
        )}
      </div>

      <textarea
        className={styles['note-editor__textarea']}
        onChange={event => setDraft({ content: event.target.value, sourceKey })}
        placeholder="Сюда можно записать контекст, идею или собственную интерпретацию."
        rows={5}
        value={content}
      />

      <button
        className={styles['note-editor__button']}
        onClick={() => {
          if (!content.trim()) {
            return
          }

          if (activeNote) {
            dispatch(updateNote({ content, id: activeNote.id }))
            return
          }

          dispatch(createNote({ content, memeId }))
        }}
        type="button"
      >
        {activeNote ? 'Обновить заметку' : 'Сохранить заметку'}
      </button>
    </section>
  )
}
