import { lazy } from 'react'

const UserListPage = lazy(() => import('./pages/UserListPage'))
const UserCreatePage = lazy(() => import('./pages/UserCreatePage'))
const UserUpdatePage = lazy(() => import('./pages/UserUpdatePage'))

export const userRoute = [
  {
    path: '/user',
    Component: UserListPage,
  },
  {
    path: '/user/view/:id',
    Component: UserUpdatePage,
  },
  {
    path: '/user/edit/:id',
    Component: UserUpdatePage,
  },
  {
    path: '/user/new',
    Component: UserCreatePage,
  },
]
