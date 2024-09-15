import { lazy } from 'react'

const RoleListPage = lazy(() => import('./pages/RoleListPage'))
const RoleCreatePage = lazy(() => import('./pages/RoleCreatePage'))
const RoleUpdatePage = lazy(() => import('./pages/RoleUpdatePage'))

export const roleRoute = [
  {
    path: '/role',
    Component: RoleListPage,
  },
  {
    path: '/role/view/:id',
    Component: RoleUpdatePage,
  },
  {
    path: '/role/edit/:id',
    Component: RoleUpdatePage,
  },
  {
    path: '/role/new',
    Component: RoleCreatePage,
  },
]
