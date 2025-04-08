import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const dashboardRoute: TRoutes = [
  {
    path: pathRoutes.dashboard,
    permission: PERMISSIONS.dashboard.view,
    Component: lazy(() => import('./DashboardPage')),
  },
  {
    path: pathRoutes.habit.detail,
    permission: PERMISSIONS.habit.view,
    Component: lazy(() => import('./HabitDetailPage')),
  },
]
