import type { MenuProps } from 'antd'
import type { Meme } from '@/entities/meme'
import { CopyOutlined, ExportOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Button, Card, Dropdown, Image, message, Space, Typography } from 'antd'
import { useMemo, useState } from 'react'
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
  const [backRoute] = useState(getLastMemeListRoute)
  const shareLinks = useMemo(() => {
    const encodedTitle = encodeURIComponent(meme.title)
    const encodedUrl = encodeURIComponent(meme.url)

    return {
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&image=${encodedUrl}`,
    }
  }, [meme.title, meme.url])

  const shareItems: MenuProps['items'] = [
    {
      key: 'vk',
      label: (
        <a
          href={shareLinks.vk}
          rel="noreferrer"
          target="_blank"
        >
          ВКонтакте
        </a>
      ),
    },
    {
      key: 'telegram',
      label: (
        <a
          href={shareLinks.telegram}
          rel="noreferrer"
          target="_blank"
        >
          Telegram
        </a>
      ),
    },
    {
      icon: <CopyOutlined />,
      key: 'copy',
      label: 'Скопировать ссылку',
      onClick: async () => {
        await navigator.clipboard.writeText(meme.url)
        message.success('Ссылка скопирована')
      },
    },
  ]

  return (
    <section className={styles['meme-details']}>
      <Card className={styles['meme-details__hero']}>
        <Typography.Text type="secondary">
          {meme.source}
        </Typography.Text>
        <Typography.Title
          className={styles['meme-details__title']}
          level={1}
        >
          {meme.title}
        </Typography.Title>
        <Typography.Paragraph className={styles['meme-details__copy']}>
          Объяснение мема подгружается автоматически при открытии страницы. При желании его можно поправить вручную.
        </Typography.Paragraph>

        <Space
          className={styles['meme-details__actions']}
          wrap
        >
          <FavoriteButton memeId={meme.id} />
          <Dropdown
            menu={{ items: shareItems }}
            trigger={['click']}
          >
            <Button icon={<ShareAltOutlined />}>
              Поделиться
            </Button>
          </Dropdown>
          <Link to={backRoute}>
            <Button icon={<ExportOutlined />}>
              К списку
            </Button>
          </Link>
        </Space>

        <Image
          alt={meme.title}
          className={styles['meme-details__image']}
          src={meme.url}
        />
      </Card>

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
