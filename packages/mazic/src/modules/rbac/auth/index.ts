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
  {
    path: pathRoutes.auth.verifyEmail,
    Component: lazy(() => import('./VerifyEmailPage')),
  },
  {
    path: pathRoutes.auth.verifyCode,
    Component: lazy(() => import('./VerifyCodePage')),
  },
  {
    path: pathRoutes.auth.forgotPassword,
    Component: lazy(() => import('./ForgotPasswordPage')),
  },
  {
    path: pathRoutes.auth.resetPassword,
    Component: lazy(() => import('./ResetPasswordPage')),
  },
]

export { type TLogin, type TRegister } from './schemas'
