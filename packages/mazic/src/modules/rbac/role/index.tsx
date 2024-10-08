import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const roleRoute: TRoutes = [
  {
    path: '/role',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/RoleListPage')),
  },
  {
    path: '/role/view/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/edit/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/new',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/RoleCreatePage')),
  },
]
