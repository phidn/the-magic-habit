import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const userPaths = {
  list: '/user',
  view: '/user/view/:id',
  edit: '/user/edit/:id',
  create: '/user/new',
  profile: '/profile',
}

export const userRoute: TRoutes = [
  {
    path: userPaths.list,
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserListPage')),
  },
  {
    path: userPaths.view,
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: userPaths.edit,
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: userPaths.create,
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/UserCreatePage')),
  },
  {
    path: userPaths.profile,
    permission: permissionsConfig.profile.save,
    Component: lazy(() => import('./pages/UserProfilePage')),
  },
]

export { type TUser } from './schemas/userSchema'
