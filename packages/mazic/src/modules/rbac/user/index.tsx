import { lazy } from 'react'

export const userRoute = [
  {
    path: '/user',
    Component: lazy(() => import('./pages/UserListPage')),
  },
  {
    path: '/user/view/:id',
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: '/user/edit/:id',
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: '/user/new',
    Component: lazy(() => import('./pages/UserCreatePage')),
  },
]

export { type TUser } from './schemas/userSchema'
