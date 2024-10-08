import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const permissionRoute: TRoutes = [
  {
    path: '/permission',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionListPage')),
  },
  {
    path: '/permission/view/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/edit/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/new',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionCreatePage')),
  },
]
