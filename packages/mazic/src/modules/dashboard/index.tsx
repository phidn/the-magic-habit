import { lazy } from 'react'

const DashboardPage = lazy(() => import('./DashboardPage'))

export const dashboardRoute = [
  {
    path: '/',
    Component: DashboardPage,
  },
]
