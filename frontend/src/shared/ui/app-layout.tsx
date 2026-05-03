import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { APP_NAME } from '@/shared/config/app'
import { ROUTES } from '@/shared/config/routes'
import { saveLastMemeListRoute } from '@/shared/lib/meme-list-route'

export function AppLayout() {
  const location = useLocation()

  useEffect(() => {
    saveLastMemeListRoute(location.pathname)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Explain the joke
          </p>
          <span className="brand">
            {APP_NAME}
          </span>
        </div>
        <nav className="nav">
          <Link
            activeOptions={{ exact: true }}
            activeProps={{ className: 'nav-link active' }}
            className="nav-link"
            to={ROUTES.home}
          >
            Мемы
          </Link>
          <Link
            activeProps={{ className: 'nav-link active' }}
            className="nav-link"
            to={ROUTES.slang}
          >
            Сленг
          </Link>
          <Link
            activeProps={{ className: 'nav-link active' }}
            className="nav-link"
            to={ROUTES.favorites}
          >
            Избранное
          </Link>
          <Link
            activeProps={{ className: 'nav-link active' }}
            className="nav-link"
            to={ROUTES.collections}
          >
            Подборки
          </Link>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
