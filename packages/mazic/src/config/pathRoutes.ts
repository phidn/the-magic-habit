import { checkInPaths } from '@mazic/modules/check-in'
import { habitPaths } from '@mazic/modules/habit'
import { userPaths } from '@mazic/modules/rbac/user'

export const pathRoutes = {
  home: '/',
  dashboard: '/dashboard',
  user: userPaths,
  checkIn: checkInPaths,
  habit: habitPaths,
  auth: {
    login: '/login',
    signUp: '/signup',
    verifyEmail: '/verify-email',
    verifyCode: '/verify',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
} as const
