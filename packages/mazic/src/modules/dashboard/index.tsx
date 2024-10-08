import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const dashboardRoute: TRoutes = [
  {
    path: '/',
    permission: permissionsConfig.dashboard.view,
    Component: lazy(() => import('./DashboardPage')),
  },
]
