import { HomeOutlined, StarOutlined, TagsOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Button } from 'antd'
import { useEffect } from 'react'
import { APP_NAME } from '@/shared/config/app'
import { ROUTES } from '@/shared/config/routes'
import { saveLastMemeListRoute } from '@/shared/lib/meme-list-route'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const navItems = [
    { icon: <HomeOutlined />, label: 'Мемы', to: ROUTES.home },
    { icon: <TagsOutlined />, label: 'Сленг', to: ROUTES.slang },
    { icon: <StarOutlined />, label: 'Избранное', to: ROUTES.favorites },
    { icon: <UnorderedListOutlined />, label: 'Подборки', to: ROUTES.collections },
  ]

  useEffect(() => {
    saveLastMemeListRoute(location.pathname)
  }, [location.pathname])

  return (
    <div className={styles['app-layout']}>
      <header className={styles['app-layout__topbar']}>
        <div>
          <p className={styles['app-layout__eyebrow']}>
            Explain the joke
          </p>
          <span className={styles['app-layout__brand']}>
            {APP_NAME}
          </span>
        </div>
        <nav className={styles['app-layout__nav']}>
          {navItems.map(item => (
            <Link
              activeOptions={item.to === ROUTES.home ? { exact: true } : undefined}
              key={item.to}
              to={item.to}
            >
              <Button
                icon={item.icon}
                type={location.pathname === item.to ? 'primary' : 'text'}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </header>

      <main className={styles['app-layout__content']}>
        <Outlet />
      </main>
    </div>
  )
}
