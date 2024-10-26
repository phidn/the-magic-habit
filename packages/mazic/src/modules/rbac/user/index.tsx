import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

const { user: userPaths } = pathRoutes

export const userRoute: TRoutes = [
  {
    path: userPaths.list,
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/UserListPage')),
  },
  {
    path: userPaths.view,
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: userPaths.edit,
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/UserUpdatePage')),
  },
  {
    path: userPaths.create,
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/UserCreatePage')),
  },
  {
    path: userPaths.profile,
    permission: PERMISSIONS.profile.save,
    Component: lazy(() => import('./pages/UserProfilePage')),
  },
]

export { type TUser } from './schemas/userSchema'
