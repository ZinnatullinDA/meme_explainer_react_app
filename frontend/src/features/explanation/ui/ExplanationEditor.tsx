import type { ChangeEvent } from 'react'
import { DeleteOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Typography } from 'antd'
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
  const [deletedExplanationId, setDeletedExplanationId] = useState<string | null>(null)
  const activeExplanation = explanation?.id === deletedExplanationId ? undefined : explanation
  const sourceContent = activeExplanation?.content ?? ''
  const sourceKey = `${memeId}:${activeExplanation?.id ?? 'new'}:${sourceContent}`
  const [draft, setDraft] = useState({ content: sourceContent, sourceKey })
  const content = draft.sourceKey === sourceKey ? draft.content : sourceContent

  function handleDeleteClick() {
    if (!activeExplanation) {
      return
    }

    setDeletedExplanationId(activeExplanation.id)
    setDraft({ content: '', sourceKey: `${memeId}:new:` })
    dispatch(deleteExplanation(activeExplanation.id))
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft({ content: event.target.value, sourceKey })
  }

  function handleGenerateClick() {
    dispatch(generateExplanation({ force: true, memeId, title }))
  }

  function handleSaveClick() {
    if (!content.trim()) {
      return
    }

    if (activeExplanation) {
      dispatch(updateExplanation({ content, id: activeExplanation.id }))
      return
    }

    dispatch(createExplanation({ content, memeId }))
  }

  return (
    <Card
      extra={activeExplanation && (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteClick}
          type="text"
        >
          Удалить
        </Button>
      )}
      title="Объяснение"
    >
      <div className={styles['explanation-editor']}>
        <Input.TextArea
          onChange={handleContentChange}
          placeholder={placeholder}
          rows={6}
          value={content}
        />

        {generationStatus === 'loading' && (
          <Typography.Text type="secondary">
            Объяснение генерируется через GigaChat...
          </Typography.Text>
        )}

        {generationError && (
          <Alert
            message={generationError}
            showIcon
            type="warning"
          />
        )}

        <div className={styles['explanation-editor__actions']}>
          <Button
            disabled={generationStatus === 'loading'}
            icon={<ReloadOutlined />}
            onClick={handleGenerateClick}
          >
            Перегенерировать
          </Button>

          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveClick}
            type="primary"
          >
            {activeExplanation ? 'Обновить' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
