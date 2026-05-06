import { HomeOutlined, MoonOutlined, StarOutlined, SunOutlined, TagsOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Button, Tooltip } from 'antd'
import { useEffect } from 'react'
import { ROUTES } from '@/shared/config/routes'
import { saveLastMemeListRoute } from '@/shared/lib/meme-list-route'
import { useThemeMode } from '@/shared/lib/theme-mode'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const { mode, toggleMode } = useThemeMode()
  const isDarkMode = mode === 'dark'
  const themeToggleLabel = isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'
  const navItems = [
    { icon: <HomeOutlined />, label: 'Мемы', to: ROUTES.home },
    { icon: <TagsOutlined />, label: 'Сленг', to: ROUTES.slang },
    { icon: <StarOutlined />, label: 'Избранное', to: ROUTES.favorites },
    { icon: <UnorderedListOutlined />, label: 'Подборки', to: ROUTES.collections },
  ]

  useEffect(() => {
    saveLastMemeListRoute(location.pathname)
  }, [location.pathname])

  function handleThemeToggleClick() {
    toggleMode()
  }

  return (
    <div className={styles['app-layout']}>
      <header className={styles['app-layout__topbar']}>
        <div>
          <span className={styles['app-layout__brand']}>
            Meme Explainer
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
          <Tooltip title={themeToggleLabel}>
            <Button
              aria-label={themeToggleLabel}
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={handleThemeToggleClick}
              shape="circle"
              type="text"
            />
          </Tooltip>
        </nav>
      </header>

      <main className={styles['app-layout__content']}>
        <Outlet />
      </main>
    </div>
  )
}
