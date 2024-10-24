import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const actionRoute: TRoutes = [
  {
    path: '/action',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ActionListPage')),
  },
  {
    path: '/action/view/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/edit/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/new',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ActionCreatePage')),
  },
]
