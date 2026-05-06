import type { ChangeEvent } from 'react'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Input } from 'antd'
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

  function handleDeleteClick() {
    if (!activeNote) {
      return
    }

    setDeletedNoteId(activeNote.id)
    setDraft({ content: '', sourceKey: `${memeId}:new:` })
    dispatch(deleteNote(activeNote.id))
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft({ content: event.target.value, sourceKey })
  }

  function handleSaveClick() {
    if (!content.trim()) {
      return
    }

    if (activeNote) {
      dispatch(updateNote({ content, id: activeNote.id }))
      return
    }

    dispatch(createNote({ content, memeId }))
  }

  return (
    <Card
      extra={activeNote && (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteClick}
          type="text"
        >
          Удалить
        </Button>
      )}
      title="Личные заметки"
    >
      <div className={styles['note-editor']}>
        <Input.TextArea
          onChange={handleContentChange}
          placeholder="Сюда можно записать контекст, идею или собственную интерпретацию."
          rows={5}
          value={content}
        />

        <Button
          icon={<SaveOutlined />}
          onClick={handleSaveClick}
          type="primary"
        >
          {activeNote ? 'Обновить заметку' : 'Сохранить заметку'}
        </Button>
      </div>
    </Card>
  )
}
