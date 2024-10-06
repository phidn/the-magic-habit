import { lazy } from 'react'

export const rolePermissionRoute = [
  {
    path: '/roles-permissions',
    Component: lazy(() => import('./pages/RolesPermissionsPage')),
  },
]
