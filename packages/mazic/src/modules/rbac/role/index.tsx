import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const roleRoute: TRoutes = [
  {
    path: '/role',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/RoleListPage')),
  },
  {
    path: '/role/view/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/edit/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/new',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/RoleCreatePage')),
  },
]

export { roleService } from './services/roleService'

export { type TRole } from './schemas/roleSchema'
