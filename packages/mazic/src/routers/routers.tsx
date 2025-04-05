import { createBrowserRouter } from 'react-router-dom'

import { ProtectedLayout } from '@mazic/layouts/ProtectedLayout/ProtectedLayout'
import { PublicLayout } from '@mazic/layouts/PublicLayout/PublicLayout'
import { checkInRoute } from '@mazic/modules/check-in'
import { dashboardRoute } from '@mazic/modules/dashboard'
import { habitRoute } from '@mazic/modules/habit'
import { homeRoute } from '@mazic/modules/home'
import { actionRoute } from '@mazic/modules/rbac/action'
import { authRoute } from '@mazic/modules/rbac/auth'
import { permissionRoute } from '@mazic/modules/rbac/permission'
import { resourceRoute } from '@mazic/modules/rbac/resource'
import { roleRoute } from '@mazic/modules/rbac/role'
import { rolePermissionRoute } from '@mazic/modules/rbac/role-permission'
import { userRoute } from '@mazic/modules/rbac/user'
import { systemRoute } from '@mazic/modules/system'

const publicRoutes = [
  ...homeRoute,
  ...checkInRoute,
  ...authRoute.map((route) => ({
    path: route.path,
    element: (
      <PublicLayout>
        <route.Component />
      </PublicLayout>
    ),
  })),
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

export const routers = createBrowserRouter([...publicRoutes, ...protectedRoutes], {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
})
