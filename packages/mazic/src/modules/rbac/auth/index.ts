import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'

export { useLogout } from './hooks/useLogout'

export const authRoute = [
  {
    path: pathRoutes.auth.login,
    Component: lazy(() => import('./LoginPage')),
  },
  {
    path: pathRoutes.auth.signUp,
    Component: lazy(() => import('./RegisterPage')),
  },
]

export { TLogin, TRegister } from './schemas'
