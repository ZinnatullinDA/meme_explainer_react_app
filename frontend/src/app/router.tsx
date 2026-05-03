import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  RouterProvider,
} from '@tanstack/react-router'
import { CollectionsPage } from '@/pages/CollectionsPage/ui/CollectionsPage'
import { FavoritesPage } from '@/pages/FavoritesPage/ui/FavoritesPage'
import { HomePage } from '@/pages/HomePage/ui/HomePage'
import { MemeDetailsPage } from '@/pages/MemeDetailsPage/ui/MemeDetailsPage'
import { SlangPage } from '@/pages/SlangPage/ui/SlangPage'
import { ROUTES } from '@/shared/config/routes'
import { AppLayout } from '@/shared/ui/AppLayout'

const rootRoute = createRootRoute({
  component: AppLayout,
  notFoundComponent: () => (
    <Navigate
      replace
      to={ROUTES.home}
    />
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.home,
  component: HomePage,
})

const memeDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.memeDetails,
  component: MemeDetailsPage,
})

const slangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.slang,
  component: SlangPage,
})

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.favorites,
  component: FavoritesPage,
})

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.collections,
  component: CollectionsPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  memeDetailsRoute,
  slangRoute,
  favoritesRoute,
  collectionsRoute,
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />
}
