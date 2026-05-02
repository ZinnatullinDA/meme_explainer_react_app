import type { MemeListRoute } from '@/shared/config/routes'
import { MEME_LIST_ROUTES, ROUTES } from '@/shared/config/routes'

const LAST_MEME_LIST_ROUTE_KEY = 'meme-explainer-last-list-route'

export function isMemeListRoute(pathname: string): pathname is MemeListRoute {
  return MEME_LIST_ROUTES.includes(pathname as MemeListRoute)
}

export function getLastMemeListRoute(): MemeListRoute {
  const storedRoute = window.sessionStorage.getItem(LAST_MEME_LIST_ROUTE_KEY)

  if (storedRoute && isMemeListRoute(storedRoute)) {
    return storedRoute
  }

  return ROUTES.home
}

export function saveLastMemeListRoute(pathname: string) {
  if (!isMemeListRoute(pathname)) {
    return
  }

  window.sessionStorage.setItem(LAST_MEME_LIST_ROUTE_KEY, pathname)
}
