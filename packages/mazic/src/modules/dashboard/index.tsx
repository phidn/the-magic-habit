import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { TRoutes } from '@mazic/types'

export const dashboardRoute: TRoutes = [
  {
    path: pathRoutes.dashboard,
    permission: permissionsConfig.dashboard.view,
    Component: lazy(() => import('./DashboardPage')),
  },
]
