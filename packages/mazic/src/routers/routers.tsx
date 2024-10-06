import { createBrowserRouter } from 'react-router-dom'

import { dashboardRoute } from '@mazic/modules/dashboard'
import { habitRoute } from '@mazic/modules/habit'
import { actionRoute } from '@mazic/modules/rbac/action'
import { LoginPage } from '@mazic/modules/rbac/auth'
import { permissionRoute } from '@mazic/modules/rbac/permission'
import { resourceRoute } from '@mazic/modules/rbac/resource'
import { roleRoute } from '@mazic/modules/rbac/role'
import { rolePermissionRoute } from '@mazic/modules/rbac/role-permission'
import { userRoute } from '@mazic/modules/rbac/user'
import AuthRoute from '@mazic/routers/AuthRoute'

const publicRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
]

const protectedRoutes = [
  ...dashboardRoute,
  ...actionRoute,
  ...resourceRoute,
  ...permissionRoute,
  ...roleRoute,
  ...rolePermissionRoute,
  ...userRoute,
  ...habitRoute,
].map((route) => ({
  path: route.path,
  element: (
    <AuthRoute>
      <route.Component />
    </AuthRoute>
  ),
}))

export const routers = createBrowserRouter([...publicRoutes, ...protectedRoutes])
