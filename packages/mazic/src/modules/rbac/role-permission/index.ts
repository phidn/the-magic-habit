import { lazy } from 'react'

const RolesPermissionsPage = lazy(() => import('./pages/RolesPermissionsPage'))

export const rolePermissionRoute = [
  {
    path: '/roles-permissions',
    Component: RolesPermissionsPage,
  },
]
