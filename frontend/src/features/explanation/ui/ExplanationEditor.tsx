import { DeleteOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { createExplanation, deleteExplanation, generateExplanation, updateExplanation } from '@/entities/explanation'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'

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

  return (
    <Card
      extra={activeExplanation && (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setDeletedExplanationId(activeExplanation.id)
            setDraft({ content: '', sourceKey: `${memeId}:new:` })
            dispatch(deleteExplanation(activeExplanation.id))
          }}
          type="text"
        >
          Удалить
        </Button>
      )}
      title="Объяснение"
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%' }}
      >
        <Input.TextArea
          onChange={event => setDraft({ content: event.target.value, sourceKey })}
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

        <Space wrap>
          <Button
            disabled={generationStatus === 'loading'}
            icon={<ReloadOutlined />}
            onClick={() => dispatch(generateExplanation({ force: true, memeId, title }))}
          >
            Перегенерировать
          </Button>

          <Button
            icon={<SaveOutlined />}
            onClick={() => {
              if (!content.trim()) {
                return
              }

              if (activeExplanation) {
                dispatch(updateExplanation({ content, id: activeExplanation.id }))
                return
              }

              dispatch(createExplanation({ content, memeId }))
            }}
            type="primary"
          >
            {activeExplanation ? 'Обновить' : 'Сохранить'}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
