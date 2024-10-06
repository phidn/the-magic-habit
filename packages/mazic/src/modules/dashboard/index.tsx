import { lazy } from 'react'

export const dashboardRoute = [
  {
    path: '/',
    Component: lazy(() => import('./DashboardPage')),
  },
]
