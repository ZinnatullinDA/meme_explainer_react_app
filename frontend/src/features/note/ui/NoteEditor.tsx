import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Input, Space } from 'antd'
import { useState } from 'react'
import { createNote, deleteNote, updateNote } from '@/entities/note'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'

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
    <Card
      extra={activeNote && (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setDeletedNoteId(activeNote.id)
            setDraft({ content: '', sourceKey: `${memeId}:new:` })
            dispatch(deleteNote(activeNote.id))
          }}
          type="text"
        >
          Удалить
        </Button>
      )}
      title="Личные заметки"
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%' }}
      >
        <Input.TextArea
          onChange={event => setDraft({ content: event.target.value, sourceKey })}
          placeholder="Сюда можно записать контекст, идею или собственную интерпретацию."
          rows={5}
          value={content}
        />

        <Button
          icon={<SaveOutlined />}
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
          type="primary"
        >
          {activeNote ? 'Обновить заметку' : 'Сохранить заметку'}
        </Button>
      </Space>
    </Card>
  )
}
