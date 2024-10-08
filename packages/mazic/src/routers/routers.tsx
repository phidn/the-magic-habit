import { createBrowserRouter } from 'react-router-dom'

import { ProtectedLayout } from '@mazic/layouts/ProtectedLayout/ProtectedLayout'
import { checkInRoute } from '@mazic/modules/check-in'
import { dashboardRoute } from '@mazic/modules/dashboard'
import { habitRoute } from '@mazic/modules/habit'
import { actionRoute } from '@mazic/modules/rbac/action'
import { LoginPage } from '@mazic/modules/rbac/auth'
import { permissionRoute } from '@mazic/modules/rbac/permission'
import { resourceRoute } from '@mazic/modules/rbac/resource'
import { roleRoute } from '@mazic/modules/rbac/role'
import { rolePermissionRoute } from '@mazic/modules/rbac/role-permission'
import { userRoute } from '@mazic/modules/rbac/user'
import { systemRoute } from '@mazic/modules/system'

const publicRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  ...checkInRoute,
]

const protectedRoutes = [
  ...actionRoute,
  ...resourceRoute,
  ...permissionRoute,
  ...roleRoute,
  ...rolePermissionRoute,
  ...userRoute,
  ...systemRoute,
  ...dashboardRoute,
  ...habitRoute,
].map((route) => ({
  path: route.path,
  element: (
    <ProtectedLayout permission={route?.permission}>
      <route.Component />
    </ProtectedLayout>
  ),
}))

export const routers = createBrowserRouter([...publicRoutes, ...protectedRoutes])
