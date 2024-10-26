import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'

export { useLogout } from './hooks/useLogout'

export const authRoute = [
  {
    path: pathRoutes.auth.login,
    Component: lazy(() => import('./pages/LoginPage')),
  },
  {
    path: pathRoutes.auth.signUp,
    Component: lazy(() => import('./pages/RegisterPage')),
  },
  {
    path: pathRoutes.auth.verifyEmail,
    Component: lazy(() => import('./pages/VerifyEmailPage')),
  },
  {
    path: pathRoutes.auth.verifyCode,
    Component: lazy(() => import('./pages/VerifyCodePage')),
  },
  {
    path: pathRoutes.auth.forgotPassword,
    Component: lazy(() => import('./pages/ForgotPasswordPage')),
  },
  {
    path: pathRoutes.auth.resetPassword,
    Component: lazy(() => import('./pages/ResetPasswordPage')),
  },
]

export { type TLogin, type TRegister } from './schemas'

export { authService } from './services/authService'
