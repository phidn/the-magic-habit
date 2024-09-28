import { lazy } from 'react'

const DashboardPage = lazy(() => import('./page'))

export const route = [
  {
    path: '/',
    Component: DashboardPage,
  },
]
