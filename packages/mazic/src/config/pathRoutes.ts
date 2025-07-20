export const pathRoutes = {
  home: '/',
  dashboard: '/dashboard',
  daily: '/daily',
  settingView: '/setting-view',
  user: {
    list: '/user',
    view: '/user/view/:id',
    edit: '/user/edit/:id',
    create: '/user/new',
    profile: '/profile',
  },
  checkIn: {
    widget: '/widget/:api_key',
  },
  habit: {
    list: '/habit',
    view: '/habit/view/:id',
    detail: '/habit/:id',
    edit: '/habit/edit/:id',
    create: '/habit/create',
  },
  auth: {
    login: '/login',
    signUp: '/signup',
    verifyEmail: '/verify-email',
    verifyCode: '/verify',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
} as const
