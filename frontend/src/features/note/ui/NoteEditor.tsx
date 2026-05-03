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
  const [content, setContent] = useState(note?.content ?? '')

  return (
    <section className={styles['note-editor']}>
      <div className={styles['note-editor__heading']}>
        <h3 className={styles['note-editor__title']}>
          Личные заметки
        </h3>
        {note && (
          <button
            className={styles['note-editor__link-button']}
            onClick={() => dispatch(deleteNote(note.id))}
            type="button"
          >
            Удалить
          </button>
        )}
      </div>

      <textarea
        className={styles['note-editor__textarea']}
        onChange={event => setContent(event.target.value)}
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

          if (note) {
            dispatch(updateNote({ content, id: note.id }))
            return
          }

          dispatch(createNote({ content, memeId }))
        }}
        type="button"
      >
        {note ? 'Обновить заметку' : 'Сохранить заметку'}
      </button>
    </section>
  )
}
