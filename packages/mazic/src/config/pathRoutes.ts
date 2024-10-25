import { checkInPaths } from '@mazic/modules/check-in'
import { userPaths } from '@mazic/modules/rbac/user'

export const pathRoutes = {
  home: '/',
  dashboard: '/dashboard',
  user: userPaths,
  checkIn: checkInPaths,
  auth: {
    login: '/login',
    signUp: '/signup',
    verifyEmail: '/verify-email',
    verifyCode: '/verify',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
} as const
