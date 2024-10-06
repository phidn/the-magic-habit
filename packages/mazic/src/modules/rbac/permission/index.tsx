import { lazy } from 'react'

export const permissionRoute = [
  {
    path: '/permission',
    Component: lazy(() => import('./pages/PermissionListPage')),
  },
  {
    path: '/permission/view/:id',
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/edit/:id',
    Component: lazy(() => import('./pages/PermissionUpdatePage')),
  },
  {
    path: '/permission/new',
    Component: lazy(() => import('./pages/PermissionCreatePage')),
  },
]
