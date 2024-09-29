import { createBrowserRouter } from 'react-router-dom'

import { route as dashboardRoute } from '@mazic/modules/dashboard/route'
import { habitRoute } from '@mazic/modules/habit/route'
import { actionRoute } from '@mazic/modules/rbac/action/actionRoute'
import { LoginPage } from '@mazic/modules/rbac/auth'
import { permissionRoute } from '@mazic/modules/rbac/permission/permissionRoute'
import { resourceRoute } from '@mazic/modules/rbac/resource/resourceRoute'
import { roleRoute } from '@mazic/modules/rbac/role/roleRoute'
import { rolePermissionRoute } from '@mazic/modules/rbac/role-permission/rolePermissionRoute'
import { userRoute } from '@mazic/modules/rbac/user/userRoute'
import AuthRoute from '@mazic/routers/AuthRoute'

const publicRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
]

const _routes = [
  ...dashboardRoute,
  ...actionRoute,
  ...resourceRoute,
  ...permissionRoute,
  ...roleRoute,
  ...rolePermissionRoute,
  ...userRoute,
  ...habitRoute,
]

const protectedRoutes = _routes.map((route) => {
  return {
    path: route.path,
    element: (
      <AuthRoute>
        <route.Component />
      </AuthRoute>
    ),
  }
})

export const routers = createBrowserRouter([...publicRoutes, ...protectedRoutes])
