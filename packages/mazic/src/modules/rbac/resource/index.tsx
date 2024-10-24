import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const resourceRoute: TRoutes = [
  {
    path: '/resource',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceListPage')),
  },
  {
    path: '/resource/view/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/edit/:id',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/new',
    permission: PERMISSIONS.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceCreatePage')),
  },
]
