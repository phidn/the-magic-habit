import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const rolePermissionRoute: TRoutes = [
  {
    path: '/roles-permissions',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/RolesPermissionsPage')),
  },
]
