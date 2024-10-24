import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const permissionRoute: TRoutes = [
  {
    path: '/permission',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionListPage')),
  },
  {
    path: '/permission/view/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/edit/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/new',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/PermissionCreatePage')),
  },
]
