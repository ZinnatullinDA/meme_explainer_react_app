import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Input, Space, Tag } from 'antd'
import { useState } from 'react'
import { createCollection, toggleCollectionMeme } from '@/entities/collection'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'

interface CollectionManagerProps {
  memeId: string
}

export function CollectionManager({ memeId }: CollectionManagerProps) {
  const dispatch = useAppDispatch()
  const collections = useAppSelector(state => state.collections.items)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Card title="Подборки">
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%' }}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            onChange={event => setName(event.target.value)}
            placeholder="Название подборки"
            value={name}
          />
          <Input
            onChange={event => setDescription(event.target.value)}
            placeholder="Короткое описание"
            value={description}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (!name.trim()) {
                return
              }

              dispatch(createCollection({ description, name }))
              setDescription('')
              setName('')
            }}
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
            <Tag.CheckableTag
              checked={collection.memeIds.includes(memeId)}
              key={collection.id}
              onChange={() => dispatch(toggleCollectionMeme({ collectionId: collection.id, memeId }))}
            >
              {collection.name}
            </Tag.CheckableTag>
          ))}
        </Space>
      </Space>
    </Card>
  )
}
