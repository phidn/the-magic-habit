import { checkInPaths } from '@mazic/modules/check-in'
import { userPaths } from '@mazic/modules/rbac/user'

export const pathRoutes = {
  dashboard: '/',
  user: userPaths,
  home: '/',
  checkIn: checkInPaths,
} as const
