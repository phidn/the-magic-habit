import { lazy } from 'react'

const DashboardPage = lazy(() => import('./page'))

export const dashboardRoute = [
  {
    path: '/',
    Component: DashboardPage,
  },
]
