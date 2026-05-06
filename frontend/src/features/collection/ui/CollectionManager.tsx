import type { ChangeEvent } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Input, Space, Tag } from 'antd'
import { useState } from 'react'
import { createCollection, toggleCollectionMeme } from '@/entities/collection'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'

interface CollectionManagerProps {
  memeId: string
}

interface CollectionToggleTagProps {
  collectionId: string
  isChecked: boolean
  name: string
  onToggle: (collectionId: string) => void
}

function CollectionToggleTag({ collectionId, isChecked, name, onToggle }: CollectionToggleTagProps) {
  function handleChange() {
    onToggle(collectionId)
  }

  return (
    <Tag.CheckableTag
      checked={isChecked}
      onChange={handleChange}
    >
      {name}
    </Tag.CheckableTag>
  )
}

export function CollectionManager({ memeId }: CollectionManagerProps) {
  const dispatch = useAppDispatch()
  const collections = useAppSelector(state => state.collections.items)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)
  }

  function handleCreateClick() {
    if (!name.trim()) {
      return
    }

    dispatch(createCollection({ description, name }))
    setDescription('')
    setName('')
  }

  function handleCollectionToggle(collectionId: string) {
    dispatch(toggleCollectionMeme({ collectionId, memeId }))
  }

  return (
    <Card title="Подборки">
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%' }}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            onChange={handleNameChange}
            placeholder="Название подборки"
            value={name}
          />
          <Input
            onChange={handleDescriptionChange}
            placeholder="Короткое описание"
            value={description}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            type="primary"
          >
            Создать
          </Button>
        </Space.Compact>

        {collections.length === 0 && (
          <Empty description="Пока нет подборок" />
        )}

        <Space wrap>
          {collections.map(collection => (
            <CollectionToggleTag
              collectionId={collection.id}
              isChecked={collection.memeIds.includes(memeId)}
              key={collection.id}
              name={collection.name}
              onToggle={handleCollectionToggle}
            />
          ))}
        </Space>
      </Space>
    </Card>
  )
}
