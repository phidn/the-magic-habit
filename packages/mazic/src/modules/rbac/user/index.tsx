import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const userRoute: TRoutes = [
  {
    path: '/user',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserListPage')),
  },
  {
    path: '/user/view/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: '/user/edit/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: '/user/new',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserCreatePage')),
  },
]

export { type TUser } from './schemas/userSchema'
