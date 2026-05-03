import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { APP_NAME } from '@/shared/config/app'
import { ROUTES } from '@/shared/config/routes'
import { saveLastMemeListRoute } from '@/shared/lib/meme-list-route'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()

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
          <Link
            activeOptions={{ exact: true }}
            activeProps={{ className: `${styles['app-layout__nav-link']} ${styles['app-layout__nav-link--active']}` }}
            className={styles['app-layout__nav-link']}
            to={ROUTES.home}
          >
            Мемы
          </Link>
          <Link
            activeProps={{ className: `${styles['app-layout__nav-link']} ${styles['app-layout__nav-link--active']}` }}
            className={styles['app-layout__nav-link']}
            to={ROUTES.slang}
          >
            Сленг
          </Link>
          <Link
            activeProps={{ className: `${styles['app-layout__nav-link']} ${styles['app-layout__nav-link--active']}` }}
            className={styles['app-layout__nav-link']}
            to={ROUTES.favorites}
          >
            Избранное
          </Link>
          <Link
            activeProps={{ className: `${styles['app-layout__nav-link']} ${styles['app-layout__nav-link--active']}` }}
            className={styles['app-layout__nav-link']}
            to={ROUTES.collections}
          >
            Подборки
          </Link>
        </nav>
      </header>

      <main className={styles['app-layout__content']}>
        <Outlet />
      </main>
    </div>
  )
}
