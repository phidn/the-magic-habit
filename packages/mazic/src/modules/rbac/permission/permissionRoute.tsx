import { lazy } from 'react'

const PermissionListPage = lazy(() => import('./pages/PermissionListPage'))
const PermissionCreatePage = lazy(() => import('./pages/PermissionCreatePage'))
const PermissionUpdatePage = lazy(() => import('./pages/PermissionUpdatePage'))

export const permissionRoute = [
  {
    path: '/permission',
    Component: PermissionListPage,
  },
  {
    path: '/permission/view/:id',
    Component: PermissionUpdatePage,
  },
  {
    path: '/permission/edit/:id',
    Component: PermissionUpdatePage,
  },
  {
    path: '/permission/new',
    Component: PermissionCreatePage,
  },
]
