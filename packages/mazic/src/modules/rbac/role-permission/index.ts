import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const rolePermissionRoute: TRoutes = [
  {
    path: '/roles-permissions',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/RolesPermissionsPage')),
  },
]
