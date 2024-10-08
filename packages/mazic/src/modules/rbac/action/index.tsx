import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const actionRoute: TRoutes = [
  {
    path: '/action',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ActionListPage')),
  },
  {
    path: '/action/view/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/edit/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/new',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ActionCreatePage')),
  },
]
