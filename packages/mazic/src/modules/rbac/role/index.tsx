import { lazy } from 'react'

export const roleRoute = [
  {
    path: '/role',
    Component: lazy(() => import('./pages/RoleListPage')),
  },
  {
    path: '/role/view/:id',
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/edit/:id',
    Component: lazy(() => import('./pages/RoleUpdatePage')),
  },
  {
    path: '/role/new',
    Component: lazy(() => import('./pages/RoleCreatePage')),
  },
]
